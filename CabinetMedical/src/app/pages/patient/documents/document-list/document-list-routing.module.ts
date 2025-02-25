import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentListPage } from './document-list.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentListPageRoutingModule {}
