import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoctorDetailsPage } from './doctor-details.page';

const routes: Routes = [
  {
    path: '',
    component: DoctorDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorDetailsPageRoutingModule {}
