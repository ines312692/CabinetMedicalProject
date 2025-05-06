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
  IonBadge, 
  IonIcon,
  IonButton,
  ToastController
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { powerOutline, powerSharp } from 'ionicons/icons';
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
    IonBadge,
    IonButton,
    IonIcon
  ]
})
export class AllAdvertisementsPage implements OnInit {
  advertisements: any[] = [];
  loading = true;

  constructor(
    private statsService: StatsService,
    private router: Router,
    private toastController: ToastController
  ) { addIcons({ powerOutline, powerSharp });}

  ngOnInit() {
    this.loadAdvertisements();
  }

  async loadAdvertisements() {
    try {
      const stats = await this.statsService.getStats('week').toPromise();
      this.advertisements = stats?.advertisements || [];
    } catch (error) {
      console.error('Error loading advertisements:', error);
      this.showToast('Failed to load advertisements', 'danger');
    } finally {
      this.loading = false;
    }
  }
  
  async toggleAdStatus(ad: any) {
    if (!ad?._id) {
      this.showToast('Invalid advertisement ID', 'danger');
      return;
    }
  
    try {
      const result = await this.statsService.toggleAdStatus(ad._id).toPromise();
      ad.active = !ad.active;
      this.showToast(
        `Advertisement ${ad.active ? 'activated' : 'deactivated'} successfully`,
        'success'
      );
    } catch (error) {
      console.error('Error toggling ad status:', error);
      this.showToast('Failed to update advertisement status', 'danger');
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }
  goBack() {
    this.router.navigate(['/admin-profile/dashboard']);
  }
}