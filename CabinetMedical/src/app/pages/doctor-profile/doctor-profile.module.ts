import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoctorProfilePageRoutingModule } from './doctor-profile-routing.module';


import {ListAppointmentPage} from "../list-appointment/list-appointment.page";
import {PatientHistoryPage} from "../patient-history/patient-history.page";
import {DoctorProfilePage} from "./doctor-profile.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoctorProfilePageRoutingModule,
    ListAppointmentPage,
    PatientHistoryPage,
    DoctorProfilePage
  ],
  declarations: []
})
export class DoctorProfilePageModule {}
