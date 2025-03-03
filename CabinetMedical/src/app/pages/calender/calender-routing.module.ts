import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalenderPage } from './calender.page';

const routes: Routes = [
  {
    path: '',
    component: CalenderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalenderPageRoutingModule {}
