import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DocumentManagementPageRoutingModule } from './document-management-routing.module';
import {DocumentUploadPage} from "../document-upload/document-upload.page";
import {DocumentListPage} from "../document-list/document-list.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocumentManagementPageRoutingModule,
    DocumentUploadPage,
    DocumentListPage
  ],
  declarations: []
})
export class DocumentManagementPageModule {}
