import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentUploadPage } from './document-upload.page';
import {DocumentUploadPageRoutingModule} from "./document-upload-routing.module";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    DocumentUploadPage,
    DocumentUploadPageRoutingModule
  ],
  declarations: []
})
export class DocumentUploadPageModule {}
