import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentViewPage } from './document-view.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentViewPageRoutingModule {}
