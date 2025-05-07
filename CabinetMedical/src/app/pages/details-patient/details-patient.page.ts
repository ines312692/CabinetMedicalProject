import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/Patient.interface';
import { AuthService } from '../../services/auth.service'; // Import du service AuthService

@Component({
  selector: 'app-details-patient',
  templateUrl: './details-patient.page.html',
  styleUrls: ['./details-patient.page.scss'],
  imports: [CommonModule, IonicModule],
  standalone: true
})
export class DetailsPatientPage implements OnInit {
  patientId: string | null = null;
  patient: Patient | null = null;
  isLoading = false;
  error: string | null = null;

  idCurrentUser: string | null = null;

  currentUserId: string | null = localStorage.getItem('userId') || ''; // ID de l'utilisateur connecté


  constructor(
    private readonly route: ActivatedRoute,
    private readonly patientService: PatientService,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('patient_id');
    console.log('Patient ID from route:', this.patientId);

    if (this.patientId) {
      this.loadPatientDetails();
    } else {
      this.error = 'Patient ID is missing';
    }

    // Récupération de l'utilisateur connecté via AuthService
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.idCurrentUser = currentUser.id; // Assurez-vous que `id` est une propriété de LoginResponse
    } else {
      console.error('No logged-in user found');
    }
  }

  loadPatientDetails(): void {
    if (!this.patientId) {
      this.error = 'Patient ID is missing';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.patientService.getPatientDetails(this.patientId).subscribe({
      next: (patient) => {
        this.patient = patient;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load patient details:', err);
        this.error = 'Failed to load patient details. Please try again.';
        this.isLoading = false;
      }
    });
  }

  openConversation() {
    if (!this.idCurrentUser) {
      console.error('No logged-in user found');
      return;
    }

    if (!this.patient) {
      console.error('Patient details are not loaded');
      return;
    }

    const senderId = this.idCurrentUser;
    const receiverId = this.patient._id;

    this.router.navigate(['/conversation', senderId, receiverId]);
  }


  goToProfile() {

        this.router.navigate(['/doctor-profile', this.currentUserId]);
  }


}
