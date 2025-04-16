import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifProfilPatientPageRoutingModule } from './modif-profil-patient-routing.module';

import { ModifProfilPatientPage } from './modif-profil-patient.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifProfilPatientPageRoutingModule
  ],
  declarations: [ModifProfilPatientPage]
})
export class ModifProfilPatientPageModule {}
