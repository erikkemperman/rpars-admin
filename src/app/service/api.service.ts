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

export type MemberGetRequest = {
}

export type MemberGetResponse = {
  project_id: number,
  project_name: string,
  group_id: number,
  group_name: string
}

export type MemberGetProjectRequest = {
}

export type MemberGetProjectResponse = {
  project_id: number,
  project_name: string
}[]

export type MemberGetGroupRequest = {
  project_id: number
}

export type MemberGetGroupResponse = {
  group_id: number,
  group_name: string
}[]

export type MemberGetUserRequest = {
  group_id: number
}

export type MemberGetUserResponse = {
  user_id: number,
  user_email: string
}[];

export type MemberGetUnassignedUserRequest = {
}

export type MemberGetUnassignedUserResponse = {
  user_id: number,
  user_email: string
}[];


export type MemberAddUsersRequest = {
  group_id: number,
  user_ids: number[]
}

export type MemberAddUsersResponse = {
}

export type MemberRemoveUserRequest = {
  user_id: number
}

export type MemberRemoveUserResponse = {
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
        if (err.status === 0 || err.status === 429 || err.status === 503) {
          if (err.status === 0) {
            err.statusText = 'It looks like the server is down';
            wait = Constants.HTTP_SERVER_DOWN_SLEEP;
          } else if (err.status === 429) {
            err.statusText = 'The server is too busy at the moment';
            wait = parseInt(await err.headers.get('Retry-After')) + 1;
          } else if (err.status === 503) {
            err.statusText = 'The server was just restarted, please retry';
            wait = 15;
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

  async memberGet(params: MemberGetRequest): Promise<MemberGetResponse> {
    return await this.post('member_get', params);
  }

  async memberGetProject(params: MemberGetProjectRequest): Promise<MemberGetProjectResponse> {
    return await this.post('member_project_get', params);
  }

  async memberGetGroup(params: MemberGetGroupRequest): Promise<MemberGetGroupResponse> {
    return await this.post('member_group_get', params);
  }

  async memberGetUser(params: MemberGetUserRequest): Promise<MemberGetUserResponse> {
    return await this.post('member_user_get', params);
  }

  async memberGetUnassignedUser(params: MemberGetUnassignedUserRequest): Promise<MemberGetUnassignedUserResponse> {
    return await this.post('member_user_unassigned_get', params);
  }

  async memberAddUsers(params: MemberAddUsersRequest): Promise<MemberAddUsersResponse> {
    return await this.post('member_add_users', params);
  }

  async removeUser(params: MemberRemoveUserRequest): Promise<MemberRemoveUserResponse> {
    return await this.post('member_remove_user', params);
  }

}
