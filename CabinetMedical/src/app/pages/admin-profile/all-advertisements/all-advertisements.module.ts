import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AllAdvertisementsPageRoutingModule } from './all-advertisements-routing.module';
import { AllAdvertisementsPage } from './all-advertisements.page';
import { StatsService } from '../../../services/stats.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllAdvertisementsPageRoutingModule
  ],
  declarations: [],
  providers: [StatsService]
})
export class AllAdvertisementsPageModule {}