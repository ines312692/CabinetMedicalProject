import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifProfilAdminPageRoutingModule } from './modif-profil-admin-routing.module';

import { ModifProfilAdminPage } from './modif-profil-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifProfilAdminPageRoutingModule
  ],
  declarations: [ModifProfilAdminPage]
})
export class ModifProfilAdminPageModule {}
