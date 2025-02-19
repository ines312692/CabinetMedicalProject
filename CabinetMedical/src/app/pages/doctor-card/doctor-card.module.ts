import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoctorCardPageRoutingModule } from './doctor-card-routing.module';

import { DoctorCardPage } from './doctor-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoctorCardPageRoutingModule,
    DoctorCardPage,
    DoctorCardPage
  ],
    exports: [
        DoctorCardPage
    ],
    declarations: []
})
export class DoctorCardPageModule {}
