// -- Authentication, mostly based on SCRAM --
// https://tools.ietf.org/html/rfc5802
// https://en.wikipedia.org/wiki/Salted_Challenge_Response_Authentication_Mechanism

import { Injectable } from '@angular/core';

import { Constants } from '../../environments/environment';
import * as api from './api.service';
import { SettingsStoreService } from './settings-store.service';


const encoder = new TextEncoder();
const HEX_REX = /^[0-9a-f]+$/;

export type Credentials = {
  email: string,
  password: string,
  key_id: number,
  public_key: string,
  private_key: string
};

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private apiService: api.ApiService,
    private settingsStoreService: SettingsStoreService
  ) {

  }

  private bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async hash(message: string): Promise<string> {
    return this.bytesToHex(new Uint8Array(
      await window.crypto.subtle.digest(
        Constants.HASH_ALGORITHM,
        encoder.encode(message)
      )
    ));
  }

  private async hmac(secret: string, message: string): Promise<Uint8Array> {
    return new Uint8Array(
      await window.crypto.subtle.sign(
        'HMAC',
        await window.crypto.subtle.importKey(
          'raw',
          encoder.encode(secret),
          {name: 'HMAC', hash: Constants.HASH_ALGORITHM},
          false,
          ['sign']
        ),
        encoder.encode(message)
      )
    )
  }

  private async pbkdf2(password: string, salt: string, its: number): Promise<string> {
    return this.bytesToHex(new Uint8Array(
      await window.crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          hash: Constants.PASSWORD_ALGORITHM,
          salt: encoder.encode(salt),
          iterations: its
        },
        await window.crypto.subtle.importKey(
          'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits', 'deriveKey']
        ),
        Constants.PASSWORD_LENGTH * 8
      )
    ));
  }

  async isLoggedIn(): Promise<boolean> {
    const sessionId = await this.settingsStoreService.fetchSessionId();
    const sessionExpiration = await this.settingsStoreService.fetchSessionExpiration();
    return !!sessionId && sessionExpiration > Date.now();
  }

  async submitLogin(email: string, password: string): Promise<string> {

    // Compute salted hash of email address
    const emailHash = await this.hash(email + Constants.HASH_SALT);

    // Generate client nonce
    const clientNonce = this.bytesToHex(
      window.crypto.getRandomValues(new Uint8Array(Constants.NONCE_LENGTH))
    );

    // Send login init message
    let initResponse: api.SessionLoginInitResponse = null;
    try {
      initResponse = await this.apiService.sessionLoginInit({
        email_hash: emailHash,
        client_nonce: clientNonce
      });
    } catch (error) {
      if (error.status !== 403) {
        console.error(error);
        throw new Error(`Failed to send init message: ${error.statusText}`);
      }
      throw new Error(error.statusText);
    }

    // Validate return values
    const serverNonce = initResponse.server_nonce;
    const clientSalt = initResponse.client_salt;
    const iterations = initResponse.iterations;
    const expiration = initResponse.challenge_expiration;

    if (initResponse.client_nonce !== clientNonce) {
      throw new Error(`Bad server response to init message: client nonce mismatch`);
    }
    if (typeof serverNonce !== 'string'
    || serverNonce.length !== Constants.NONCE_LENGTH * 2
    || !HEX_REX.test(serverNonce)) {
      throw new Error(`Bad server response to init message: illegal server nonce`);
    }
    if (typeof clientSalt !== 'string'
    || clientSalt.length !== Constants.HASH_LENGTH * 2
    || !HEX_REX.test(clientSalt)) {
      throw new Error(`Bad server response to init message: illegal client salt`);
    }
    if (typeof iterations !== 'number'
    || Math.round(iterations) !== iterations
    || iterations < Constants.ITERATIONS_MIN) {
      throw new Error(`Bad server response to init message: illegal iterations`);
    }
    if (typeof expiration !== 'number'
    || Math.round(expiration) !== expiration
    || expiration < 0) {
      throw new Error(`Bad server response to init message: illegal expiration`);
    }


    // Compute the final auth content, which client and server will use to mutually
    // prove to another to have knowledge of the client and server keys, and thus
    // implicitly of the user's password.
    const auth = `${emailHash},${clientNonce},${serverNonce},${clientSalt}`;

    // Compute strengthened password
    const passwordHash = await this.pbkdf2(password, clientSalt, iterations);

    // Compute client proof
    const clientKey = await this.hmac(passwordHash, 'Client Key');
    const clientHash = await this.hash(this.bytesToHex(clientKey));
    const clientProof = await this.hmac(clientHash, auth);
    for (let i = 0; i < Constants.HASH_LENGTH; i++) {
      clientProof[i] ^= clientKey[i]
    }

    // Send login finish message
    let finiResponse: api.SessionLoginFiniResponse = null;
    try {
      finiResponse = await this.apiService.sessionLoginFini({
        email_hash: emailHash,
        client_nonce: clientNonce,
        server_nonce: serverNonce,
        iterations: iterations,
        challenge_expiration: expiration,
        client_proof: this.bytesToHex(clientProof)
      });
    } catch (error) {
      if (error.status !== 403) {
        console.error(error);
        throw new Error(`Failed to send fini message: ${error.statusText}`);
      }
      throw new Error(error.statusText);
    }

    // Validate return values
    const serverProof = finiResponse.server_proof;
    const sessionId = finiResponse.session_id;
    const admin = finiResponse.admin;
    if (typeof serverProof !== 'string'
    || serverProof.length !== Constants.NONCE_LENGTH * 2
    || !HEX_REX.test(serverProof)) {
      throw new Error(`Bad server response to fini message: illegal server proof`);
    }
    if (typeof sessionId !== 'string'
    || serverNonce.length !== Constants.NONCE_LENGTH * 2
    || !HEX_REX.test(sessionId)) {
      throw new Error(`Bad server response to init message: illegal sessionId`);
    }
    if (typeof admin !== 'boolean') {
      throw new Error(`Bad server response to init message: illegal admin flag`);
    }

    // Verify server proof
    const serverKey = this.bytesToHex(await this.hmac(passwordHash, 'Server Key'));
    const serverProofCheck = this.bytesToHex(await this.hmac(serverKey, auth));
    if (serverProof !== serverProofCheck) {
      throw new Error(`Bad server response to fini message: invalid server proof`);
    }

    // Check we have admin privilege
    if (admin !== true) {
      throw new Error(`Error: this account has no administrator privileges`);
    }

    // Save session id and admin flag
    await this.settingsStoreService.storeSessionId(sessionId);
    await this.settingsStoreService.storeAdmin(admin);


    return sessionId;
  }

  async submitLogout(): Promise<void> {

    // Send logout message
    let initResponse: api.SessionLogoutResponse = null;
    try {
      initResponse = await this.apiService.sessionLogout({});
    } catch (error) {
      if (error.status !== 403) {
        console.error(error);
        throw new Error(`Failed to send logout message: ${error.statusText}`);
      }
      throw new Error(error.statusText);
    } finally {
      // Clear session id and expiration
      await this.settingsStoreService.storeSessionId('');
      await this.settingsStoreService.storeSessionExpiration(Date.now() - 1);
    }
  }
}
