import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { DocumentUploadPage } from '../pages/patient/documents/document-upload/document-upload.page';
import { DocumentListPage } from '../pages/patient/documents/document-list/document-list.page';
import { DocumentViewPage } from '../pages/patient/documents/document-view/document-view.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'document-upload',
        component: DocumentUploadPage
      },
      {
        path: 'document-list',
        component: DocumentListPage
      },
      {
        path: 'document-view',
        component: DocumentViewPage
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
