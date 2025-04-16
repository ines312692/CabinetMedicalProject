import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifProfilAdminPage } from './modif-profil-admin.page';

const routes: Routes = [
  {
    path: '',
    component: ModifProfilAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifProfilAdminPageRoutingModule {}
