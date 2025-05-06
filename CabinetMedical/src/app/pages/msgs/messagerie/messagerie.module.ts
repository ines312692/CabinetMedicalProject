import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessageriePageRoutingModule } from './messagerie-routing.module';

import { MessageriePage } from './messagerie.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessageriePageRoutingModule
  ],
  declarations: [MessageriePage]
})
export class MessageriePageModule {}
