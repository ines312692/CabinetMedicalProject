import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Doctor } from '../../models/Docter.interface';
import { DoctorService } from 'src/app/services/doctor.service';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ManageAppointmentsPage } from '../manage-appointments/manage-appointments.page';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.page.html',
  styleUrls: ['./doctor-profile.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    FormsModule,
    ManageAppointmentsPage
  ]
})
export class DoctorProfilePage implements OnInit {
  doctorDetails: Doctor | null = null;
  isLoadingDoctor = false;
  selectedTab = 'manage-appointments';
  doctorId: string | null = null;

  constructor(
    private readonly doctorService: DoctorService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.doctorId = this.route.snapshot.paramMap.get('doctor_id');
    if (this.doctorId) {
      this.loadDoctorData(this.doctorId);
    } else {
      console.error('No doctor ID found in route');
    }
  }

  private loadDoctorData(doctorId: string) {
    this.isLoadingDoctor = true;
    this.doctorService.getDoctorById(doctorId).subscribe({
      next: (data: Doctor) => {
        this.doctorDetails = data;
        this.isLoadingDoctor = false;
      },
      error: (err) => {
        console.error('Error loading doctor details:', err);
        this.isLoadingDoctor = false;
      }
    });
  }

}
