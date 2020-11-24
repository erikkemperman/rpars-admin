import { Component } from '@angular/core';

import { LoadingController, ToastController } from '@ionic/angular';

import { SessionService, Credentials } from '../service/session.service';
import { Constants } from '../../environments/environment';


@Component({
  selector: 'app-tab-profile',
  templateUrl: 'tab-profile.page.html',
  styleUrls: ['tab-profile.page.scss']
})
export class TabProfilePage {

  loggedIn: boolean;
  loginEmail: string;
  loginPassword: string;

  private checker = null;

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private sessionService: SessionService
  ) {
    this.loggedIn = false;
  }

  ngOnInit() {
    console.log('Profile tab: ngOnInit');
  }

  async ionViewWillEnter() {
    console.log('Profile tab: will enter');
    await this.checkStatus();
    this.checker = setInterval(async () => { await this.checkStatus(); }, Constants.PERIOD_REENTER);
  }

  async ionViewWillLeave() {
    console.log('Profile tab: will leave');
    if (this.checker) {
      clearInterval(this.checker);
    }
  }


  async checkStatus() {
    console.log('Profile tab: check status');
    this.loggedIn = await this.sessionService.isLoggedIn();
    if (!this.loggedIn && (!this.loginEmail || !this.loginPassword)) {
      this.loginEmail = '';
      this.loginPassword = '';
      // if (this.loginEmail && this.loginPassword) {
      //   await this.loginSubmit();
      //   this.loggedIn = await this.sessionService.isLoggedIn();
      // }
    }
  }

  async loginSubmit(): Promise<boolean> {
    if (!this.loginEmail) {
      const toast = await this.toastController.create({
        message: 'The email address must not be empty',
        duration: Constants.TOAST_DURATION_ERROR,
        position: Constants.TOAST_POSITION,
        color: 'warning'
      })
      toast.present();
      return false;
    }

    if (!this.loginPassword) {
      const toast = await this.toastController.create({
        message: 'The password must not be empty',
        duration: Constants.TOAST_DURATION_ERROR,
        position: Constants.TOAST_POSITION,
        color: 'warning'
      })
      toast.present();
      return false;
    }

    const loading = await this.loadingController.create({
      message: 'Logging in...',
      backdropDismiss: false,
      translucent: true
    });
    await loading.present();

    let sessionId: string = null;
    try {
      sessionId = await this.sessionService.submitLogin(
        this.loginEmail,
        this.loginPassword
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
    this.loggedIn = true;
    const toast = await this.toastController.create({
      message: 'You are succesfully logged in',
      duration: Constants.TOAST_DURATION_SUCCESS,
      position: Constants.TOAST_POSITION,
      color: 'success'
    })
    toast.present();

    return true;
  }

  async logoutSubmit(): Promise<boolean> {
    const loading = await this.loadingController.create({
      message: 'Logging out...',
      backdropDismiss: false,
      translucent: true
    });
    await loading.present();

    try {
      await this.sessionService.submitLogout();
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
    this.loggedIn = false;
    const toast = await this.toastController.create({
      message: 'You are succesfully logged out',
      duration: Constants.TOAST_DURATION_SUCCESS,
      position: Constants.TOAST_POSITION,
      color: 'success'
    })
    toast.present();

    return true;
  }

}
