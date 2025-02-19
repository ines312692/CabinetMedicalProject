import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { DocumentUploadPageModule } from '../pages/patient/documents/document-upload/document-upload.module';
import { DocumentListPageModule } from '../pages/patient/documents/document-list/document-list.module';
import { DocumentViewPageModule } from '../pages/patient/documents/document-view/document-view.module';
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    DocumentUploadPageModule,
    DocumentListPageModule,
    DocumentViewPageModule
  ],
  declarations: [HomePage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {
  

  




}
