import { Injectable } from '@angular/core';

import * as api from './api.service';

export type Project = {
  project_id: number,
  project_name: string,
  project_members: Group[]
};

export type Group = {
  group_id: number,
    group_name: string,
    group_members: User[]
};

export type User = {
  user_id: number,
  user_email: string
};

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(
    private apiService: api.ApiService
  ) {

  }

  async getMembers(): Promise<Project[]> {
    let projectsResponse: api.MemberGetProjectResponse = null;
    try {
      projectsResponse = await this.apiService.memberGetProject({});
    } catch (error) {
      if (error.status !== 403) {
        console.error(error);
        throw new Error(`Failed to get projects: ${error.statusText}`);
      }
      throw new Error(error.statusText);
    }

    const projects: Project[] = [];

    for (const projectResponse of projectsResponse) {
      const projectId: number = projectResponse.project_id;

      const groups = [];
      const project = {
        project_id: projectResponse.project_id,
        project_name: projectResponse.project_name,
        project_members: groups
      };
      projects.push(project);

      let groupsResponse: api.MemberGetGroupResponse = null;
      try {
        groupsResponse = await this.apiService.memberGetGroup({project_id: projectId});
      } catch (error) {
        if (error.status !== 403) {
          console.error(error);
          throw new Error(`Failed to get groups for project ${projectId}: ${error.statusText}`);
        }
        throw new Error(error.statusText);
      }

      for (const groupResponse of groupsResponse) {
        const groupId = groupResponse.group_id;

        const users = [];
        const group = {
          group_id: groupResponse.group_id,
          group_name: groupResponse.group_name,
          group_members: users
        }
        groups.push(group);

        let usersResponse: api.MemberGetUserResponse = null;
        try {
          usersResponse = await this.apiService.memberGetUser({group_id: groupId});
        } catch (error) {
          if (error.status !== 403) {
            console.error(error);
            throw new Error(`Failed to get users for group ${groupId}: ${error.statusText}`);
          }
          throw new Error(error.statusText);
        }

        for (const userResponse of usersResponse) {
          users.push({
            user_id: userResponse.user_id,
            user_email: userResponse.user_email
          })
        }
      }
    }

    return projects;
  }

  async getUnassignedUsers(): Promise<User[]> {
    let userResponse: api.MemberGetUnassignedUserResponse = null;
    try {
      userResponse = await this.apiService.memberGetUnassignedUser({});
    } catch (error) {
      if (error.status !== 403) {
        console.error(error);
        throw new Error(`Failed to get unassigned users: ${error.statusText}`);
      }
      throw new Error(error.statusText);
    }
    const users = [];
    for (const user of userResponse) {
      users.push(user);
    }
    return userResponse;
  }

  async addUsers(group_id: number, user_ids: number[]): Promise<void> {
    let addUserResponse: api.MemberAddUsersResponse = null;
    try {
      addUserResponse = await this.apiService.memberAddUsers({
        group_id: group_id,
        user_ids: user_ids
      });
    } catch (error) {
      if (error.status !== 403) {
        console.error(error);
        throw new Error(`Failed to add users to group: ${error.statusText}`);
      }
      throw new Error(error.statusText);
    }
  }

  async removeUser(user_id: number): Promise<void> {
    let removeUserResponse: api.MemberRemoveUserResponse = null;
    try {
      removeUserResponse = await this.apiService.removeUser({
        user_id: user_id
      });
    } catch (error) {
      if (error.status !== 403) {
        console.error(error);
        throw new Error(`Failed to remove user from group: ${error.statusText}`);
      }
      throw new Error(error.statusText);
    }
  }

}