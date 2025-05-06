import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllAdvertisementsPage } from './all-advertisements.page';

const routes: Routes = [
  {
    path: '',
    component: AllAdvertisementsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllAdvertisementsPageRoutingModule {}
