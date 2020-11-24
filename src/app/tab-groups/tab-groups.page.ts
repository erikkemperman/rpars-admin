import { Component } from '@angular/core';

import { AlertController, LoadingController, ToastController } from '@ionic/angular';

import { MemberService, Project, Group, User } from '../service/member.service';
import { SessionService } from '../service/session.service';
import { Constants } from '../../environments/environment';


@Component({
  selector: 'app-tab-groups',
  templateUrl: 'tab-groups.page.html',
  styleUrls: ['tab-groups.page.scss']
})
export class TabGroupsPage {

  loggedIn: boolean;
  members: Project[] = [];
  unassigned: User[] = [];

  private checker = null;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private sessionService: SessionService,
    private memberService: MemberService
  ) {}

  ngOnInit() {
    console.log('Groups tab: ngOnInit');
  }

  async ionViewWillEnter() {
    console.log('Groups tab: will enter');
    await this.checkStatus();
    this.checker = setInterval(async () => { await this.checkStatus(); }, Constants.PERIOD_REENTER);
  }

  async ionViewWillLeave() {
    console.log('Groups tab: will leave');
    if (this.checker) {
      clearInterval(this.checker);
    }
  }


  async checkStatus() {
    console.log('Groups tab: check status');
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
      this.unassigned = [];

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

      try {
        this.unassigned = await this.memberService.getUnassignedUsers();
        console.log('Unassigned users:', this.unassigned);
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

      return true;
    }
  }

  async addUser(group_id: number, user_ids_str: string[]) {
    const loading = await this.loadingController.create({
      message: 'Adding user(s) to group...',
      backdropDismiss: false,
      translucent: true
    });
    await loading.present();

    const user_ids: number[] = user_ids_str.map((i) => parseInt(i));
    try {
      await this.memberService.addUsers(group_id, user_ids);
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

    const toast = await this.toastController.create({
      message: 'Users added to group',
      duration: Constants.TOAST_DURATION_SUCCESS,
      position: Constants.TOAST_POSITION,
      color: 'success'
    })
    toast.present();

    return await this.refreshMembers();
  }

  async removeUser(project: Project, group: Group, user: User) {

    const confirm = await new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Alert!',
        subHeader: 'Are you sure?',
        message: `Remove user <b>${user.user_email}</b><br />`
                + `from group <b>${group.group_name}</b><br />`
                + `in project <b>${project.project_name}</b>?`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => resolve(false)
          },
          {
            text: 'Confirm',
            role: 'confirm',
            cssClass: 'secondary',
            handler: () => resolve(true)
          }
        ]
      });
      await alert.present();
    })
    if (!confirm) {
      return;
    }

    const loading = await this.loadingController.create({
      message: `Removing user ${user.user_email}...`,
      backdropDismiss: false,
      translucent: true
    });
    await loading.present();

    try {
      await this.memberService.removeUser(user.user_id);
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

    const toast = await this.toastController.create({
      message: 'User removed from group',
      duration: Constants.TOAST_DURATION_SUCCESS,
      position: Constants.TOAST_POSITION,
      color: 'success'
    })
    toast.present();

    return await this.refreshMembers();
  }

}
