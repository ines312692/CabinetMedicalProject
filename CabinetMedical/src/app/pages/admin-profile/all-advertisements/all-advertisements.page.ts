import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../../services/stats.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StatsResponse } from '../../../models/stats.interface';

import { 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonAvatar, 
  IonLabel, 
  IonBadge 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-advertisements',
  templateUrl: './all-advertisements.page.html',
  styleUrls: ['./all-advertisements.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonBadge
  ]
})
export class AllAdvertisementsPage implements OnInit {
  advertisements: any[] = [];
  loading = true;

  constructor(
    private statsService: StatsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadAdvertisements();
  }

  async loadAdvertisements() {
    try {
      // Get stats data which includes advertisements
      const stats = await this.statsService.getStats('week').toPromise();
      this.advertisements = stats?.advertisements || [];
    } catch (error) {
      console.error('Error loading advertisements:', error);
    } finally {
      this.loading = false;
    }
  }
  goBack() {
    this.router.navigate(['/admin-profile/dashboard']);
  }
}