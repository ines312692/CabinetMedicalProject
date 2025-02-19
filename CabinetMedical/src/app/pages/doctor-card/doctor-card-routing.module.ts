import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoctorCardPage } from './doctor-card.page';

const routes: Routes = [
  {
    path: '',
    component: DoctorCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorCardPageRoutingModule {}
