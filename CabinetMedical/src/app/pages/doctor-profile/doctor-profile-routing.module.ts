import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DoctorProfilePage } from './doctor-profile.page';


const routes: Routes = [
  {
    path: '',
    component: DoctorProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorProfilePageRoutingModule {}
