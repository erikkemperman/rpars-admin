import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab-profile',
        loadChildren: () => import('../tab-profile/tab-profile.module').then(m => m.TabProfilePageModule)
      },
      {
        path: 'tab-groups',
        loadChildren: () => import('../tab-groups/tab-groups.module').then(m => m.TabGroupsPageModule)
      },
      {
        path: 'tab-edit',
        loadChildren: () => import('../tab-edit/tab-edit.module').then(m => m.TabEditPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab-profile',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab-profile',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
