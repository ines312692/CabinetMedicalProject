import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/doctor.service';
import { Appointment } from '../../models/Appointment.interface';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.page.html',
  styleUrls: ['./appointment-details.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class AppointmentDetailsPage implements OnInit {

  appointment?: Appointment; // Marqué comme optionnel
  doctor: any = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private doctorService: DoctorService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.appointment = navigation.extras.state['appointment'];
    }
  }

  ngOnInit() {
    if (this.appointment) {
      this.loadDoctorDetails();
    } else {
      this.errorMessage = 'Aucune information de rendez-vous disponible';
    }
  }

  loadDoctorDetails() {
    if (!this.appointment?.doctor_id) { // Vérification avec l'opérateur optionnel
      this.errorMessage = 'Aucune information de médecin disponible';
      return;
    }

    this.isLoading = true;
    // Convertir doctor_id en chaîne si c'est un objet avec $oid
    const doctorId = typeof this.appointment.doctor_id === 'object'
      ? (this.appointment.doctor_id as any).$oid
      : this.appointment.doctor_id;

    this.doctorService.getDoctorById(doctorId).subscribe(
      (response) => {
        // @ts-ignore
        this.doctor = response.doctor || response; // Assurez-vous que la réponse correspond au modèle attendu
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement des informations du médecin:', error);
        this.errorMessage = 'Impossible de charger les informations du médecin';
        this.isLoading = false;
      }
    );
  }

  getStatusClass() {
    switch (this.appointment?.status) {
      case 'accepted':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'refused':
        return 'status-refused';
      default:
        return '';
    }
  }

  getStatusIcon() {
    switch (this.appointment?.status) {
      case 'accepted':
        return 'checkmark-circle-outline';
      case 'pending':
        return 'time-outline';
      case 'refused':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  }

  goBack() {
    this.router.navigate(['/patient-details']);
  }

  openDocumentUpload() {
    // Extract doctor ID for document upload
    const doctorId = typeof this.appointment?.doctor_id === 'object'
      ? (this.appointment.doctor_id as any).$oid
      : this.appointment?.doctor_id;

    // Set up navigation with query parameters
    const navigationExtras: NavigationExtras = {
      queryParams: {
        doctorId: doctorId
      }
    };

    this.router.navigate(['/document-management'], navigationExtras);
  }
}
