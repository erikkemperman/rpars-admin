import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AceEditorModule } from 'ng2-ace-editor';

import { TabEditPage } from './tab-edit.page';
import { TabEditPageRoutingModule } from './tab-edit-routing.module'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AceEditorModule,
    RouterModule.forChild([{ path: '', component: TabEditPage }]),
    TabEditPageRoutingModule,
  ],
  declarations: [TabEditPage]
})
export class TabEditPageModule {}
