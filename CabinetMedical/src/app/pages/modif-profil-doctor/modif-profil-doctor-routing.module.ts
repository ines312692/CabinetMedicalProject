import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifProfilDoctorPage } from './modif-profil-doctor.page';

const routes: Routes = [
  {
    path: '',
    component: ModifProfilDoctorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifProfilDoctorPageRoutingModule {}
