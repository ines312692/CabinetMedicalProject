import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { AuthService } from '../../services/auth.service';
import { Doctor } from '../../models/Docter.interface';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TabsPage } from "../tabs/tabs.page";
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.page.html',
  styleUrls: ['./doctor-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DoctorProfilePage implements OnInit {
  doctorDetails: Doctor | null = null;
  isEditing = false;
  editedDetails: any = {};

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.loadDoctorData(user.id);
    }
  }
// Add loading state
isLoading = false;
private loadDoctorData(doctorId: string) {
  this.isLoading = true;
  this.doctorService.getDoctorDetails(doctorId).subscribe({
    next: (data: any) => {
      this.doctorDetails = this.dataService.transformMongoId(data);
      this.editedDetails = { ...this.doctorDetails };
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading details:', err);
      this.isLoading = false;
    }
  });
}

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    if (this.doctorDetails) {
      this.isLoading = true;
      this.doctorService.updateDoctorProfile(this.doctorDetails._id, this.editedDetails)
        .subscribe({
          next: () => {
            this.doctorDetails = { ...this.editedDetails };
            this.isEditing = false;
            this.isLoading = false;
            // Add success toast/message
          },
          error: (err: any) => {
            console.error('Update failed:', err);
            this.isLoading = false;
            // Add error toast/message
          }
        });
    }
  }
}