import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifProfilPatientPage } from './modif-profil-patient.page';

const routes: Routes = [
  {
    path: '',
    component: ModifProfilPatientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifProfilPatientPageRoutingModule {}
