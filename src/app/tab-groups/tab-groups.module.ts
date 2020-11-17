import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabGroupsPage } from './tab-groups.page';

import { TabGroupsPageRoutingModule } from './tab-groups-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: TabGroupsPage }]),
    TabGroupsPageRoutingModule
  ],
  declarations: [TabGroupsPage]
})
export class TabGroupsPageModule {}
