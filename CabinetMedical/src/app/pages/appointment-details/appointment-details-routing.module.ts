import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppointmentDetailsPage } from './appointment-details.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentDetailsPageRoutingModule {}
