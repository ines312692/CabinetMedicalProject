import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddPubPage } from './add-pub.page';

const routes: Routes = [
  {
    path: '',
    component: AddPubPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddPubPageRoutingModule {}
