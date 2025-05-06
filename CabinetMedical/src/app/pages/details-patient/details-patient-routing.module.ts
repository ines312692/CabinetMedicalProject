import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsPatientPage } from './details-patient.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsPatientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsPatientPageRoutingModule {}
