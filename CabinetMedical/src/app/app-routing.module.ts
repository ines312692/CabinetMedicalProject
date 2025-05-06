import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DoctorDetailsPage } from "./pages/doctor-details/doctor-details.page";
import { AdminGuard } from "./guards/admin.guard";
import { DoctorGuard } from "./guards/doctor.guard";
import {PatientGuard} from "./guards/patient.guard";
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  //rayen==================================================================================
  //=======================================================================================
  //=======================================================================================
  //=======================================================================================
  //=======================================================================================
  {
    path: 'admin-profile',
    loadChildren: () => import('./pages/admin-profile/admin-profile.module').then(m => m.AdminProfilePageModule)
  },
 

  //=======================================================================================
  //=======================================================================================
  //=======================================================================================
  //=======================================================================================
  {
    path: 'document-upload',
    loadChildren: () => import('./pages/patient/documents/document-upload/document-upload.module').then(m => m.DocumentUploadPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'document-list',
    loadChildren: () => import('./pages/patient/documents/document-list/document-list.module').then(m => m.DocumentListPageModule)
  },

  {path: 'documents',loadChildren: () => import('./pages/patient/documents/document-management/document-management.module').then(m => m.DocumentManagementPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },

  {
    path: 'doctor-details/:id',
    component: DoctorDetailsPage
  },
  {
    path: 'doctor-card',
    loadChildren: () => import('./pages/doctor-card/doctor-card.module').then(m => m.DoctorCardPageModule)
  },
  {
    path: 'doctor-grid',
    loadChildren: () => import('./pages/doctor-grid/doctor-grid.module').then(m => m.DoctorGridPageModule)
  },

  {
    path: 'doctor-profile/:doctor_id',
    loadChildren: () => import('./pages/doctor-profile/doctor-profile.module').then(m => m.DoctorProfilePageModule)
    ,canActivate: [DoctorGuard],

  },
  {
    path: 'admin-profile',
    loadChildren: () => import('./pages/admin-profile/admin-profile.module').then(m => m.AdminProfilePageModule)
    ,canActivate: [AdminGuard],
  },
  {
    path: 'calender',
    loadChildren: () => import('./pages/calender/calender.module').then(m => m.CalenderPageModule)
  },
  {
    path: 'patient-history/:id',
    loadChildren: () => import('./pages/patient-history/patient-history.module').then(m => m.PatientHistoryPageModule)
  },
  {
    path: 'appointment-confirmation',
    loadChildren: () => import('./pages/appointment-confirmation/appointment-confirmation.module').then( m => m.AppointmentConfirmationPageModule)
  },
  {
    path: 'document-management',
    loadChildren: () => import('./pages/patient/documents/document-management/document-management.module').then(m => m.DocumentManagementPageModule)
  },

  { path: 'manage-appointments/:doctor_id',  loadChildren: () => import('./pages/manage-appointments/manage-appointments.module').then( m => m.ManageAppointmentsPageModule)},

  {
    path: 'list-appointment/:patient_id',
    loadChildren: () => import('./pages/list-appointment/list-appointment.module').then( m => m.ListAppointmentPageModule)
  },

  {
    path: 'add-doctor',
    loadChildren: () => import('./pages/admin-profile/add-doctor/add-doctor.module').then( m => m.AddDoctorPageModule)
  },
  {
    path: 'add-pub',
    loadChildren: () => import('./pages/admin-profile/add-pub/add-pub.module').then( m => m.AddPubPageModule)
  },

  {
    path: 'modif-profil-admin',
    loadChildren: () => import('./pages/modif-profil-admin/modif-profil-admin.module').then( m => m.ModifProfilAdminPageModule)
  },
  {
    path: 'modif-profil-doctor',
    loadChildren: () => import('./pages/modif-profil-doctor/modif-profil-doctor.module').then( m => m.ModifProfilDoctorPageModule)
  },
  {
    path: 'modif-profil-patient',
    loadChildren: () => import('./pages/modif-profil-patient/modif-profil-patient.module').then( m => m.ModifProfilPatientPageModule)
  },
  {

    path: 'profile-patient/:patient_id',
    loadChildren: () => import('./pages/profile-patient/profile-patient.module').then( m => m.ProfilePatientPageModule)
    ,canActivate: [PatientGuard],
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'appointment-details',
    loadChildren: () => import('./pages/appointment-details/appointment-details.module').then( m => m.AppointmentDetailsPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'messagerie',
    loadChildren: () => import('./pages/msgs/messagerie/messagerie.module').then( m => m.MessageriePageModule)
  },
  {
    path: 'conversation/:senderId/:receiverId',
    loadChildren: () => import('./pages/msgs/conversation/conversation.module').then( m => m.ConversationPageModule)
  }





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
