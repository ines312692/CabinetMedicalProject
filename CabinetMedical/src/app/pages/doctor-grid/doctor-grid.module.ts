import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoctorGridPageRoutingModule } from './doctor-grid-routing.module';

import { DoctorGridPage } from './doctor-grid.page';
import {DoctorCardPageModule} from "../doctor-card/doctor-card.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoctorGridPageRoutingModule,
    DoctorCardPageModule,
    DoctorGridPage
  ],
  declarations: []
})
export class DoctorGridPageModule {}
