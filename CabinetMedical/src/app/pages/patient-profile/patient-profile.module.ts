import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientProfilePageRoutingModule } from './patient-profile-routing.module';

import { PatientProfilePage } from './patient-profile.page';
import {PatientHistoryPageRoutingModule} from "../patient-history/patient-history-routing.module";
import {PatientHistoryPage} from "../patient-history/patient-history.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientProfilePageRoutingModule,
    PatientProfilePage
  ],
  declarations: []
})
export class PatientProfilePageModule {}
