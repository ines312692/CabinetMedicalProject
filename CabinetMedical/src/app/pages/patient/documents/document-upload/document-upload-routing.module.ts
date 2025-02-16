import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentUploadPage } from './document-upload.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentUploadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentUploadPageRoutingModule {}
