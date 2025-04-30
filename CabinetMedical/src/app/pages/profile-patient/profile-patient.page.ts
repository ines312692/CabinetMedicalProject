import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { PatientService } from 'src/app/services/patient.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { LoginResponse } from 'src/app/models/LoginResponse.interface';
import { Patient } from 'src/app/models/Patient.interface';
import { IonicModule } from '@ionic/angular';
import { PatientHistoryPage } from "../patient-history/patient-history.page";
import { ListAppointmentPage } from "../list-appointment/list-appointment.page";
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-patient',
  templateUrl: './profile-patient.page.html',
  styleUrls: ['./profile-patient.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    NgForOf,
    PatientHistoryPage,
    ListAppointmentPage,
    FormsModule
  ]
})
export class ProfilePatientPage implements OnInit {
  patientDetails: Patient | null = null;
  isLoadingPatient = false;
  selectedTab = 'history'; // Default tab

  constructor(
    private patientService: PatientService,
    private authService: AuthService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {

    const patientIdFromRoute = this.route.snapshot.paramMap.get('patient_id');

    if (patientIdFromRoute) {
      this.loadPatientData(patientIdFromRoute);
    } else {
      // If no ID in route, try to get the current logged-in user
      const user: LoginResponse | null = this.authService.getCurrentUser();
      if (user && user.role === 'patient') {
        this.loadPatientData(user.id);
      } else {
        console.error('No logged-in patient found or user is not a patient');
      }
    }

  }

  private loadPatientData(patientId: string) {
    this.isLoadingPatient = true;
    this.patientService.getPatientDetails(patientId).subscribe({
      next: (data: any) => {
        // Transformation des IDs MongoDB si nécessaire
        this.patientDetails = this.dataService.transformMongoId(data) as Patient;
        console.log('Patient details loaded:', this.patientDetails);
        this.isLoadingPatient = false;
      },
      error: (err) => {
        console.error('Error loading patient details:', err);
        this.isLoadingPatient = false;
      }
    });
  }

}
