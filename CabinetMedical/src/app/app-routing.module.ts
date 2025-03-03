import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {DoctorDetailsPage} from "./pages/doctor-details/doctor-details.page";

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'document-upload',
    loadChildren: () => import('./pages/patient/documents/document-upload/document-upload.module').then( m => m.DocumentUploadPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'document-list',
    loadChildren: () => import('./pages/patient/documents/document-list/document-list.module').then( m => m.DocumentListPageModule)
  },
  {
    path: 'document-view',
    loadChildren: () => import('./pages/patient/documents/document-view/document-view.module').then( m => m.DocumentViewPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'doctor-details',
    loadChildren: () => import('./pages/doctor-details/doctor-details.module').then( m => m.DoctorDetailsPageModule)
  },
  { path: 'doctor-details/:id', component: DoctorDetailsPage },
  {
    path: 'doctor-card',
    loadChildren: () => import('./pages/doctor-card/doctor-card.module').then( m => m.DoctorCardPageModule)
  },
  {
    path: 'doctor-grid',
    loadChildren: () => import('./pages/doctor-grid/doctor-grid.module').then( m => m.DoctorGridPageModule)
  },
  
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'patient-profile',
    loadChildren: () => import('./pages/patient-profile/patient-profile.module').then( m => m.PatientProfilePageModule)
  },
  {
    path: 'doctor-profile',
    loadChildren: () => import('./pages/doctor-profile/doctor-profile.module').then( m => m.DoctorProfilePageModule)
  },
  {
    path: 'admin-profile',
    loadChildren: () => import('./pages/admin-profile/admin-profile.module').then( m => m.AdminProfilePageModule)
  },

 
  





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
