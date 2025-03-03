import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientProfilePage } from './patient-profile.page';

const routes: Routes = [
  {
    path: '',
    component: PatientProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientProfilePageRoutingModule {}
