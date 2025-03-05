import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientProfilePageRoutingModule } from './patient-profile-routing.module';

import { PatientProfilePage } from './patient-profile.page';
<<<<<<< HEAD
import {PatientHistoryPageRoutingModule} from "../patient-history/patient-history-routing.module";
import {PatientHistoryPage} from "../patient-history/patient-history.page";
=======
>>>>>>> a1466ef77d73bc0405defc76acdad8d677bc86da

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
<<<<<<< HEAD
    PatientProfilePageRoutingModule,
    PatientProfilePage
  ],
  declarations: []
=======
    PatientProfilePageRoutingModule
  ],
  declarations: [PatientProfilePage]
>>>>>>> a1466ef77d73bc0405defc76acdad8d677bc86da
})
export class PatientProfilePageModule {}
