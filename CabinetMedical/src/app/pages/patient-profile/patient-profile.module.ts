import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientProfilePageRoutingModule } from './patient-profile-routing.module';

import { PatientProfilePage } from './patient-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientProfilePageRoutingModule
  ],
  declarations: [PatientProfilePage]
})
export class PatientProfilePageModule {}
