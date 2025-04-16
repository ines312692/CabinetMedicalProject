import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListAppointmentPageRoutingModule } from './list-appointment-routing.module';

import { ListAppointmentPage } from './list-appointment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListAppointmentPageRoutingModule,
    ListAppointmentPage
  ],
  declarations: []
})
export class ListAppointmentPageModule {}
