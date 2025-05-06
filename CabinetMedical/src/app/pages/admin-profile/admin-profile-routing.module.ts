import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminProfilePage } from './admin-profile.page';
import { AdminDashboardPage } from './admin-dashboard/admin-dashboard.page';
import { AllAdvertisementsPage } from './all-advertisements/all-advertisements.page';

const routes: Routes = [
  {
    path: '',
    component: AdminProfilePage,
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardPage // Directly reference the standalone component
      },
      {
        path: 'all-advertisements',
        component: AllAdvertisementsPage
      }
    ]
  },
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.module').then( m => m.AdminDashboardPageModule)
  },
  {
    path: 'all-advertisements',
    loadChildren: () => import('./all-advertisements/all-advertisements.module').then( m => m.AllAdvertisementsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminProfilePageRoutingModule {}