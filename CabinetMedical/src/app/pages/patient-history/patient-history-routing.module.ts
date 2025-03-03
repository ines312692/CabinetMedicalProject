import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientHistoryPage } from './patient-history.page';

const routes: Routes = [
  {
    path: '',
    component: PatientHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientHistoryPageRoutingModule {}
