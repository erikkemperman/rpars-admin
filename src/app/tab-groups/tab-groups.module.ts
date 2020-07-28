import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabGroupsPage } from './tab-groups.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TabGroupsPageRoutingModule } from './tab-groups-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TabGroupsPageRoutingModule
  ],
  declarations: [TabGroupsPage]
})
export class TabGroupsPageModule {}
