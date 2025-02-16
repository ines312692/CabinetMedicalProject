import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoctorDetailsPageRoutingModule } from './doctor-details-routing.module';

import { DoctorDetailsPage } from './doctor-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoctorDetailsPageRoutingModule,
    DoctorDetailsPage
  ],
  declarations: []
})
export class DoctorDetailsPageModule {}
