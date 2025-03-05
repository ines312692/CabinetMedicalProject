import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { FormsModule } from '@angular/forms';
=======
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
>>>>>>> a1466ef77d73bc0405defc76acdad8d677bc86da

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
<<<<<<< HEAD
    SignupPageRoutingModule,
    SignupPage
  ],
  declarations: []
=======
    SignupPageRoutingModule, 
    ReactiveFormsModule
  ],
  declarations: [SignupPage]
>>>>>>> a1466ef77d73bc0405defc76acdad8d677bc86da
})
export class SignupPageModule {}
