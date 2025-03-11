import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppointmentConfirmationPage} from "./appointment-confirmation.page";


const routes: Routes = [
  {
    path: '',
    component: AppointmentConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentConfirmationPageRoutingModule {}
