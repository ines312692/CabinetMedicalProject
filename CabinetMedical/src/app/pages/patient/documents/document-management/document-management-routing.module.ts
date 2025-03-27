import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentManagementPage } from './document-management.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentManagementPageRoutingModule {}
