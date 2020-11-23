// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { ToastOptions } from '@ionic/core';

export const environment = {
  production: false
};

export class Constants {
  //static readonly API_URL_BASE: string = 'http://localhost:8080/api/';
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
