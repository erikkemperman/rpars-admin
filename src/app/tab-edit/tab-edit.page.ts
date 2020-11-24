import { Component } from '@angular/core';

import { AlertController, LoadingController, ToastController } from '@ionic/angular';

import { MemberService, Group, Project } from '../service/member.service';
import { SessionService } from '../service/session.service';
import { Constants } from '../../environments/environment';
import { ScriptService, Script } from '../service/script.service';


@Component({
  selector: 'app-tab-edit',
  templateUrl: 'tab-edit.page.html',
  styleUrls: ['tab-edit.page.scss']
})
export class TabEditPage {

  loggedIn: boolean = false;
  members: Project[] = [];
  project: Project = null;
  project_id: number = -1;
  group: Group = null;
  group_id: number = -1;

  script: Script = null;
  source: string = null;
  locked: boolean = null;

  private checker = null;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private sessionService: SessionService,
    private memberService: MemberService,
    private scriptService: ScriptService
  ) {}

  ngOnInit() {
    console.log('Edit tab: ngOnInit');
  }

  async ionViewWillEnter() {
    console.log('Edit tab: will enter');
    await this.checkStatus();
    this.checker = setInterval(async () => { await this.checkStatus(); }, Constants.PERIOD_REENTER);
  }

  async ionViewWillLeave() {
    console.log('Edit tab: will leave');
    if (this.checker) {
      clearInterval(this.checker);
    }
  }

  async checkStatus() {
    console.log('Edit tab: check status');
    this.loggedIn = await this.sessionService.isLoggedIn();
    await this.refreshMembers();
    await this.refreshScript();
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

      // Update selected project and group (might have been deleted)
      const pid = this.project_id;
      this.project_id = -1;
      this.project = null;
      if (pid > 0) {
        for (const project of this.members) {
          if (project.project_id === pid) {
            this.project_id = pid;
            this.project = project;
            break
          }
        }
      }
      if (this.project_id > 0) {
        const gid = this.group_id;
        this.group_id = -1;
        this.group = null;
        if (gid > 0) {
          for (const project of this.members) {
            if (project.project_id === this.project_id) {
              for (const group of project.project_members) {
                if (group.group_id === gid) {
                  this.group_id = gid;
                  this.group = group;
                  break;
                }
              }
              break;
            }
          }
        }
      } else {
        this.group_id = -1;
        this.group = null;
      }

      loading.dismiss();

      return true;

    }
  }

  async refreshScript() {
    if (this.loggedIn) {
      console.log('refresh script', this.group_id);
      if (this.group_id < 0) {
        this.script = null;
        this.source = '// Please select a project and group';
        this.locked = false;
        return true;
      }

      let script: Script = null;

      const loading = await this.loadingController.create({
        message: 'Loading script...',
        backdropDismiss: false,
        translucent: true
      });
      await loading.present();
      try {
        script = await this.scriptService.getGroupScript(this.group_id);
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

      if (script) {
        if (!this.script || script.source === this.script.source
          && script.locked === this.script.locked) {
            this.script = script;
            return;
        }

        const confirm = await new Promise<boolean>(async (resolve) => {
          const alert = await this.alertController.create({
            header: 'Alert!',
            subHeader: 'This script was changed on the server',
            message: `Do you want to reload the server version or keep yours?`,
            buttons: [
              {
                text: 'Reload',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => resolve(false)
              },
              {
                text: 'Keep',
                role: 'confirm',
                cssClass: 'secondary',
                handler: () => resolve(true)
              }
            ]
          });
          await alert.present();
        })
        if (!confirm) {
          this.script = script;
          this.source = this.script.source;
          this.locked = this.script.locked;
        }

      }
    }
  }

  async revertScript() {
    this.source = this.script.source;
  }

  async saveScript() {
    if (this.loggedIn) {

      const loading = await this.loadingController.create({
        message: 'Saving script...',
        backdropDismiss: false,
        translucent: true
      });
      await loading.present();
      try {
        this.script.source = this.source;
        this.script.locked = this.locked;
        await this.scriptService.saveScript(
          this.script.script_id,
          this.source,
          this.locked
        );
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
        message: 'Your script was saved',
        duration: Constants.TOAST_DURATION_SUCCESS,
        position: Constants.TOAST_POSITION,
        color: 'success'
      })
      toast.present();

      await this.refreshScript();
    }
  }

  async setProject(project_str: string) {
    const pid = this.project_id;
    this.project_id = parseInt(project_str);
    console.log(pid, this.project_id);
    if (pid !== this.project_id) {
      for (const project of this.members) {
        if (project.project_id === this.project_id) {
          this.project = project;
          break;
        }
      }
      this.group_id = -1;
      this.group = null;
      console.log('group null');
    }
    return true;
  }

  async setGroup(group_str: string) {
    const gid = this.group_id;
    this.group_id = parseInt(group_str);
    if (gid !== this.group_id) {
      for (const project of this.members) {
        if (project.project_id === this.project_id) {
          for (const group of project.project_members) {
            if (group.group_id === this.group_id) {
              this.group = group;
              break;
            }
          }
          this.project = project;
          break;
        }
      }
      await this.refreshScript();
    }
    return true;
  }


}
