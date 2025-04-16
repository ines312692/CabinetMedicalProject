import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPubPageRoutingModule } from './add-pub-routing.module';

import { AddPubPage } from './add-pub.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddPubPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AddPubPage]
})
export class AddPubPageModule {}
