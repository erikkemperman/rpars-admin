import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabGroupsPage } from './tab-groups.page';

const routes: Routes = [
  {
    path: '',
    component: TabGroupsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabGroupsPageRoutingModule {}
