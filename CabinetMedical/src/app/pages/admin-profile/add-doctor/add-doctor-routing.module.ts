import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddDoctorPage } from './add-doctor.page';

const routes: Routes = [
  {
    path: '',
    component: AddDoctorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDoctorPageRoutingModule {}
