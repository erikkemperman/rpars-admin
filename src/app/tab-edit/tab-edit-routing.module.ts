import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabEditPage } from './tab-edit.page';

const routes: Routes = [
  {
    path: '',
    component: TabEditPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabEditPageRoutingModule {}
