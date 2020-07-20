import { Injectable } from '@angular/core';

import { Storage } from '@capacitor/core';
import * as session from './session.service';

// The keys to use for stored settings
const KEY_PREFIX = 'settings.';
export enum SettingsKey {
  USER_CREDENTIALS = 'credentials',
  SESSION_ID = 'session_id',
  SESSION_EXPIRATION = 'session_expiration'
}


@Injectable({
  providedIn: 'root'
})
export class SettingsStoreService {

  private secure: boolean;

  constructor(
  ) {
    //console.debug('settings store service ctor');
    this.secure = undefined;
  }

  async fetch<T>(key: SettingsKey): Promise<T> {
    const ret: {value: string} = await Storage.get({key: KEY_PREFIX + key});
    //console.debug('store get "' + key + '"', ret.value);
    return JSON.parse(ret.value);
  }

  async fetchSecure<T>(key: SettingsKey): Promise<T> {
    let value: string = 'null';
    return await this.fetch(key);
  }

  async store(key: SettingsKey, value: any): Promise<void> {
    const val: string = JSON.stringify(value);
    await Storage.set({key: KEY_PREFIX + key, value: val});
    //console.debug('store set "' + key + '"', value);
  }

  async storeSecure(key: SettingsKey, value: any): Promise<void> {
    const val: string = JSON.stringify(value);
    this.store(key, value);
  }

  async fetchSessionId(): Promise<string> {
    return await this.fetch(SettingsKey.SESSION_ID);
  }

  async storeSessionId(sessionId: string): Promise<void> {
    return await this.store(SettingsKey.SESSION_ID, sessionId);
  }

  async fetchSessionExpiration(): Promise<number> {
    return parseInt(await this.fetch(SettingsKey.SESSION_EXPIRATION));
  }

  async storeSessionExpiration(sessionExpiration: number): Promise<void> {
    return await this.store(SettingsKey.SESSION_EXPIRATION, sessionExpiration.toString());
  }
}
