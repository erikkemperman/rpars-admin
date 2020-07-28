import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabMeasurePage } from './tab-measure.page';

const routes: Routes = [
  {
    path: '',
    component: TabMeasurePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabMeasurePageRoutingModule {}
