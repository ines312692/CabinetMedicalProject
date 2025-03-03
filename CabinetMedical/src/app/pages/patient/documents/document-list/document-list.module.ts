import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DocumentListPage } from './document-list.page';
import {DocumentListPageRoutingModule} from "./document-list-routing.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocumentListPage,
    DocumentListPageRoutingModule
  ]
})
export class DocumentListPageModule {}
