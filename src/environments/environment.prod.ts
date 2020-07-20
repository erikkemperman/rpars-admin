export const environment = {
  production: true
};

export class Constants {
  static readonly API_URL_BASE: string = 'https://rpars.eur.nl/api/';
  static readonly HTTP_RETRY_LIMIT: number = 5;
  static readonly HTTP_SERVER_DOWN_SLEEP: number = 15; // seconds
  static readonly HASH_SALT: string = '-=#ShouldDoTheTrick666#=-';
  static readonly HASH_ALGORITHM: string = 'SHA-512';
  static readonly HASH_LENGTH: number = 64; // bytes
  static readonly NONCE_LENGTH: number = 64; // bytes
  static readonly PASSWORD_ALGORITHM: string = 'SHA-512';
  static readonly PASSWORD_LENGTH: number = 512; // bytes
  static readonly ITERATIONS_MIN: number = 65_536;
  static readonly KEYPAIR_LENGTH: number = 512; // bytes
  static readonly KEYPAIR_ALGORITHM: string = 'RSA-OAEP';
  static readonly KEYPAIR_HASH_ALGORITHM: string = 'SHA-512';
  static readonly CREDENTIALS_LOADED_EXPIRATION: number = 60_000; // 1 minute
  static readonly TOAST_POSITION: 'top' | 'bottom' | 'middle' = 'top';
  static readonly TOAST_DURATION_SUCCESS: number = 2_500; // 2.5 seconds
  static readonly TOAST_DURATION_ERROR: number = 5_000; // 5 seconds
}