import { getLocaleWeekEndRange } from '@angular/common';
import { Injectable } from '@angular/core';

import * as api from './api.service';

export type Script = {
  script_id: number,
  locked: boolean,
  source: string
};


@Injectable({
  providedIn: 'root'
})
export class ScriptService {

  constructor(
    private apiService: api.ApiService
  ) {

  }

  async getScript(): Promise<Script> {
    let scriptResponse: api.ScriptGetResponse = null;
    try {
      scriptResponse = await this.apiService.getScript({});
    } catch (error) {
      if (error.status !== 403) {
        console.error(error);
        throw new Error(`Failed to get scripts: ${error.statusText}`);
      }
      throw new Error(error.statusText);
    }

    return {
      script_id: scriptResponse.script_id,
      locked: scriptResponse.locked,
      source: scriptResponse.source
    };
  }

  async getGroupScript(group_id: number): Promise<Script> {
    let scriptResponse: api.ScriptGetGroupResponse = null;
    try {
      scriptResponse = await this.apiService.getGroupScript({
        group_id: group_id
      });
    } catch (error) {
      if (error.status !== 403) {
        console.error(error);
        throw new Error(`Failed to get scripts: ${error.statusText}`);
      }
      throw new Error(error.statusText);
    }

    return {
      script_id: scriptResponse.script_id,
      locked: scriptResponse.locked,
      source: scriptResponse.source
    };
  }

  async saveScript(script_id: number, source: string, locked: boolean) {
    let scriptResponse: api.ScriptPutResponse = null;
    try {
      scriptResponse = await this.apiService.putScript({
        script_id: script_id,
        source: source,
        locked: locked
      });
    } catch (error) {
      if (error.status !== 403) {
        console.error(error);
        throw new Error(`Failed to save scripts: ${error.statusText}`);
      }
      throw new Error(error.statusText);
    }

    return; // TODO compile errors?
  }

}