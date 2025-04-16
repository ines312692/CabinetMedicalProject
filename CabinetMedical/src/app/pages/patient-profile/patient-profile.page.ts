import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { AuthService } from '../../services/auth.service';
import { History, DiagnosticsData } from '../../models/patient.interface';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TabsPage } from "../tabs/tabs.page";

import { DataService } from '../../services/data.service';
import { DoctorService } from '../../services/doctor.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.page.html',
  styleUrls: ['./patient-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  providers: [DatePipe]
})
export class PatientProfilePage implements OnInit {
  getAppointmentColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      case 'confirmed': return 'primary';
      default: return 'medium';
    }
  }
  patientDetails: any;
  /*medicalHistory: History | null = {
    appointments: [],
    consultations: []
  };*/
  medicalHistory: History = {
    appointments: [],
    consultations: []
  };
  diagnostics: DiagnosticsData | null = null;
 
  
  constructor(
    private patientService: PatientService,
    private authService: AuthService,
    private dataService: DataService,
  private datePipe: DatePipe,
    private doctorService: DoctorService,
    private tabsPage: TabsPage // Inject TabsPage to access the method
  ) {}
  

  ngOnInit() {
    // Check if the patientDetails is already loaded
    console.log('Image path:', `assets/img/${this.patientDetails?.image || 'default-avatar.png'}`);
    const user = this.authService.getCurrentUser();
    if (user) {
      this.loadPatientData(user.id);
    }
  }
  // Add loading states
isLoadingPatient = false;
isLoadingHistory = false;
private loadPatientData(patientId: string) {
  this.isLoadingPatient = true;
  this.isLoadingHistory = true;

  this.patientService.getPatientDetails(patientId).subscribe({
    next: (data) => {
      this.patientDetails = this.dataService.transformMongoId(data);
      this.isLoadingPatient = false;
    },
    error: (err) => {
      console.error('Error loading details:', err);
      this.isLoadingPatient = false;
    }
  });

  this.isLoadingHistory = true;
  
  this.patientService.getPatientHistory(patientId).subscribe({
    next: (history) => {
      console.log('History data received:', history);
      this.medicalHistory = history;
      this.isLoadingHistory = false;
      
      // Load doctor details for each appointment/consultation if needed
      this.loadDoctorDetails();
    },
    error: (err) => {
      console.error('Error loading history:', err);
      this.isLoadingHistory = false;
    }
  });
}



private loadDoctorDetails() {
  // Load doctor details for appointments
  this.medicalHistory.appointments.forEach(app => {
    if (app.doctor_id && !app.doctor) {
      this.doctorService.getDoctorById(app.doctor_id).subscribe(doctor => {
        app.doctor = doctor;
      });
    }
  });
  
  // Load doctor details for consultations
  this.medicalHistory.consultations.forEach(con => {
    if (con.doctor_id && !con.doctor) {
      this.doctorService.getDoctorById(con.doctor_id).subscribe(doctor => {
        con.doctor = doctor;
      });
    }
  });
}
}