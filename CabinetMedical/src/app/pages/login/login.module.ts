import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { FormsModule } from '@angular/forms';
=======
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
>>>>>>> a1466ef77d73bc0405defc76acdad8d677bc86da

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
<<<<<<< HEAD
    LoginPage
  ],
  declarations: []
=======
    ReactiveFormsModule,
  ],
  declarations: [LoginPage]
>>>>>>> a1466ef77d73bc0405defc76acdad8d677bc86da
})
export class LoginPageModule {}
