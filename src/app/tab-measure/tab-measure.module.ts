import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabMeasurePage } from './tab-measure.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TabMeasurePageRoutingModule } from './tab-measure-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TabMeasurePageRoutingModule
  ],
  declarations: [TabMeasurePage]
})
export class TabMeasurePageModule {}
