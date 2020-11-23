import { Component } from '@angular/core';

import { AlertController, LoadingController, ToastController } from '@ionic/angular';

import { MemberService, Project, Group, User } from '../service/member.service';
import { SessionService } from '../service/session.service';
import { Constants } from '../../environments/environment';


@Component({
  selector: 'app-tab-edit',
  templateUrl: 'tab-edit.page.html',
  styleUrls: ['tab-edit.page.scss']
})
export class TabEditPage {

  loggedIn: boolean = false;
  members: Project[] = [];
  project: Project | null = null;
  group: Group | null = null;

  source = "// Hello world\n"
  + "\n"
  + "if (isMember(user, 'test_group_A') {\n"
  + "  showDialog('Hello member of group A');\n"
  + "}\n"
  + "\n"
  + "if (isMember(user, 'test_group_B') {\n"
  + "  showQuestion('How are you feeling today?', [\n"
  + "    1: 'Very Bad',\n"
  + "    1: 'Bad',\n"
  + "    1: 'Neutral',\n"
  + "    1: 'Good',\n"
  + "    1: 'Very Good',\n"
  + "  ]);\n"
  + "}\n"


  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private sessionService: SessionService,
    private memberService: MemberService
  ) {}

  async ionViewWillEnter() {
    console.log('Edit tab: will enter');
    this.loggedIn = await this.sessionService.isLoggedIn();
    await this.refreshMembers();
  }

  async refreshMembers() {
    if (this.loggedIn) {

      const loading = await this.loadingController.create({
        message: 'Loading projects and groups...',
        backdropDismiss: false,
        translucent: true
      });
      await loading.present();

      this.members = [];
      try {
        this.members = await this.memberService.getMembers();
        console.log('Loaded members:', this.members);
      } catch (error) {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: `${error}`,
          duration: Constants.TOAST_DURATION_ERROR,
          position: Constants.TOAST_POSITION,
          color: 'danger'
        });
        toast.present();
        return false;
      }

      loading.dismiss();

      if (this.project === null) {
        if (this.members.length > 0) {
          this.project = this.members[0];
          if (this.project.project_members.length > 0) {
            this.group = this.project.project_members[0];
          } else {
            this.group = null;
          }
        }
      }

      return true;

    }
  }

  async setProject(project_str: string) {
    const project_id: number = parseInt(project_str);
    for (const project of this.members) {
      if (project.project_id === project_id) {
        this.project = project;
        break
      }
    }
  }

  async setGroup(group_str: string) {
    const group_id: number = parseInt(group_str);
    for (const group of this.project.project_members) {
      if (group.group_id === group_id) {
        this.group = group;
        break
      }
    }
  }

}
