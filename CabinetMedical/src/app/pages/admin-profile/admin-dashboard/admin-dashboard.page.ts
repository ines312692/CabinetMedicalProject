import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../../services/stats.service';
import { StatsResponse, PeriodSelection } from '../../../models/stats.interface';
import { Appointment } from '../../../models/Appointment.interface';
import { Doctor } from '../../../models/Docter.interface';
import { IonHeader, IonContent, IonSegment } from "@ionic/angular/standalone";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';





@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]  
  
})

export class AdminDashboardPage implements OnInit {
  defaultPeriod: string = 'weekly';
  stats: StatsResponse | null = null;
  loading = false;
  error: string | null = null;
  
// Update your periods array to match backend expectations:
periods: PeriodSelection[] = [
  { value: 'day', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' }
];
  selectedPeriod: PeriodSelection = this.periods[1]; // Default to week

  constructor(private statsService: StatsService, private router: Router) {}

  ngOnInit(): void {
    this.loadStats();
  }
/*
  loadStats(): void {
  this.loading = true;
  this.error = null;
  
  this.statsService.getStats(this.selectedPeriod.value).subscribe({
    next: (data) => {
      console.log('Stats data:', data);
      this.stats = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error loading stats:', err);
      this.error = err.message || 'Failed to load statistics';
      this.loading = false;
      
      // Fallback data
      this.stats = {
        appointments: {
          total: 0,
          accepted: 0,
          pending: 0,
          rejected: 0
        },
        documents: {
          byType: [],
          byStatus: []
        },
        responseTime: {
          average: 0,
          byDoctor: []
        }
      };
    }
  });
}
*/
// admin-dashboard.page.ts
loadStats(): void {
  this.loading = true;
  this.error = null;
  
  this.statsService.getStats(this.selectedPeriod.value).subscribe({
    next: (data) => {
      console.log('Stats data:', data);
      this.stats = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error loading stats:', err);
      this.error = err.message || 'Failed to load statistics';
      this.loading = false;
      
      // Updated fallback data to match StatsResponse interface
      this.stats = {
        appointments: {
          total: 0,
          accepted: 0,
          pending: 0,
          rejected: 0
        },
        documents: {
          byType: [],
          viewed: 0,
          pending: 0
        },
        responseTime: {
          average: 0,
          byDoctor: []
        },
        advertisements: []
      };
    }
  });
}
viewAllAdvertisements() {
  this.router.navigate(['/admin-profile/all-advertisements']);
}
  // Updated method to handle possible undefined
  onPeriodChange(value: any): void {
    const period = this.periods.find(p => p.value === value);
    if (period) {
      this.selectedPeriod = period;
      this.loadStats();
    }
  }

  exportAppointments(): void {
    if (!this.stats) return;
   /* 
    this.statsService.getAppointmentsByPeriod(this.selectedPeriod.value).subscribe({
      next: (appointments) => {
        this.statsService.exportAppointmentsToPDF(appointments).subscribe(blob => {
          this.downloadFile(blob, `appointments-${this.selectedPeriod.value}.pdf`);
        });
      },
      error: (err) => console.error('Export failed:', err)
    });
    */
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}