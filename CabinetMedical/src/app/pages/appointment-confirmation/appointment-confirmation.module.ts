import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppointmentConfirmationPageRoutingModule } from './appointment-confirmation-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppointmentConfirmationPageRoutingModule,
    DatePipe
  ],
  declarations: []
})
export class AppointmentConfirmationPageModule {}
