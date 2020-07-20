import { Component } from '@angular/core';
import { SessionService } from '../service/session.service';

@Component({
  selector: 'app-tab-groups',
  templateUrl: 'tab-groups.page.html',
  styleUrls: ['tab-groups.page.scss']
})
export class TabGroupsPage {

  private loggedIn: boolean;

  constructor(
    private sessionService: SessionService
  ) {}

  async ionViewWillEnter() {
    console.log('Groups tab: will enter');
    this.loggedIn = await this.sessionService.isLoggedIn();
  }
}
