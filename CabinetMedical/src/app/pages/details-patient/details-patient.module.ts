import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsPatientPageRoutingModule } from './details-patient-routing.module';

import { DetailsPatientPage } from './details-patient.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsPatientPageRoutingModule,
    DetailsPatientPage
  ],
  declarations: []
})
export class DetailsPatientPageModule {}
