import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TabsPageModule } from './pages/tabs/tabs.module';
import {TabsPage} from "./pages/tabs/tabs.page";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {DoctorDetailsPage} from "./pages/doctor-details/doctor-details.page";
<<<<<<< HEAD
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(),
     AppRoutingModule, 
     TabsPageModule, 
     TabsPage,
      BrowserAnimationsModule,
       HttpClientModule,
        DoctorDetailsPage,
         DoctorDetailsPage,
         ReactiveFormsModule,],
=======
import {DocumentUploadPage} from "./pages/patient/documents/document-upload/document-upload.page";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, TabsPageModule, TabsPage, BrowserAnimationsModule, HttpClientModule],
>>>>>>> 7351cd2dd80db713f466e0eab572a8ab0f4bb710
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule {}
