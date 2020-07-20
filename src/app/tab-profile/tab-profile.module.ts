import { IonicModule, ModalController } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabProfilePage } from './tab-profile.page';
import { TabProfilePageRoutingModule } from './tab-profile-routing.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabProfilePageRoutingModule
  ],
  declarations: [TabProfilePage]
})
export class TabProfilePageModule {

  constructor() {
  }

}
