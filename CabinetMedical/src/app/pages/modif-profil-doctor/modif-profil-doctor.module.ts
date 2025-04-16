import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifProfilDoctorPageRoutingModule } from './modif-profil-doctor-routing.module';

import { ModifProfilDoctorPage } from './modif-profil-doctor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifProfilDoctorPageRoutingModule
  ],
  declarations: [ModifProfilDoctorPage]
})
export class ModifProfilDoctorPageModule {}
