import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { SettingsStoreService } from './settings-store.service';
import { Constants } from '../../environments/environment';



export type SessionLoginInitRequest = {
  email_hash: string,
  client_nonce: string
}

export type SessionLoginInitResponse = {
  client_nonce: string,
  server_nonce: string,
  client_salt: string,
  iterations: number
  challenge_expiration: number
}

export type SessionLoginFiniRequest = {
  email_hash: string,
  client_nonce: string,
  server_nonce: string,
  iterations: number,
  challenge_expiration: number,
  client_proof: string
}

export type SessionLoginFiniResponse = {
  server_proof: string,
  session_id: string,
  expiration: number,
  admin: boolean
}

export type SessionLogoutRequest = {
}

export type SessionLogoutResponse = {
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private settingsStoreService: SettingsStoreService
  ) {
  }

  async post(endpoint: string, params: object): Promise<any> {
    let response = null;
    let attempts = Constants.HTTP_RETRY_LIMIT;
    let wait = 0;
    while (true) {
      attempts -= 1;
      try {
        const sessionId = await this.settingsStoreService.fetchSessionId() || '';
        response = await this.httpClient.post(
          Constants.API_URL_BASE + endpoint, params, {
            headers: new HttpHeaders().set('Authorization', sessionId)
          }
        ).toPromise();
        // Update expiration
        if (response.expiration) {
          let sessionExpiration = response.expiration || -1;
          if (typeof sessionExpiration !== 'number'
          || Math.round(sessionExpiration) !== sessionExpiration
          || sessionExpiration < 0) {
            throw new Error(`Bad server response: illegal session expiration`);
          }
          sessionExpiration += Date.now();
          await this.settingsStoreService.storeSessionExpiration(sessionExpiration);
        }
        return response;
      } catch (err) {

        // If server is down or busy, retry a couple of times
        if (err.status === 0 || err.status === 429) {
          if (err.status === 0) {
            err.statusText = 'It looks like the server is down';
            wait = Constants.HTTP_SERVER_DOWN_SLEEP;
          } else if (err.status === 429) {
            err.statusText = 'The server is too busy at the moment';
            wait = parseInt(await err.headers.get('Retry-After')) + 1;
          }
          if (attempts > 0) {
            console.log(`Server busy or down, try again in ${wait} seconds`);
            await new Promise(r => setTimeout(r, wait * 1_000));
            continue;
          }
        }
        throw err;
      }
    }
  }

  async sessionLoginInit(params: SessionLoginInitRequest): Promise<SessionLoginInitResponse> {
    return await this.post('session_login_init', params);
  }

  async sessionLoginFini(params: SessionLoginFiniRequest): Promise<SessionLoginFiniResponse> {
    return await this.post('session_login_fini', params);
  }

  async sessionLogout(params: SessionLogoutRequest): Promise<SessionLogoutResponse> {
    return await this.post('session_logout', params);
  }

}
