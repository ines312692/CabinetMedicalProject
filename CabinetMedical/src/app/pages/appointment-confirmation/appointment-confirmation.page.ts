import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { DatePipe, NgIf } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { AppointmentService } from '../../services/appointmentservice.service';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../models/LoginResponse.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-confirmation',
  templateUrl: './appointment-confirmation.page.html',
  standalone: true,
  imports: [IonicModule, NgIf],
  providers: [DatePipe],
  styleUrls: ['./appointment-confirmation.page.scss']
})
export class AppointmentConfirmationPage implements OnInit {
  appointment: any;
  patientId: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly doctorService: DoctorService,
    private readonly datePipe: DatePipe,
    private readonly appointmentService: AppointmentService,
    private readonly alertController: AlertController,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    const currentUser: LoginResponse | null = this.authService.getCurrentUser();
    if (currentUser && currentUser.role === 'patient') {
      this.patientId = currentUser.id;
    } else {
      console.error('No logged-in patient found or user is not a patient');
      this.showAlert('Error', 'Please log in as a patient to confirm an appointment.');
    }

    this.route.queryParams.subscribe(params => {
      console.log('Params:', params);
      if (params['appointmentId']) {
        this.appointment = this.doctorService.getAppointmentDetails();
        console.log('Appointment details:', JSON.stringify(this.appointment, null, 2));
        if (!this.appointment || !this.appointment.doctor) {
          console.error('Appointment or doctor details missing');
        }
      } else {
        console.error('appointmentId not provided in queryParams');
      }
    });
  }

  getFormattedDate(date: string): string {
    return this.datePipe.transform(date, 'fullDate') || '';
  }

  async confirmAppointment() {
    console.log('Appointment:', this.appointment);

    // Validate appointment, doctor, and patient
    if (!this.appointment || !this.appointment.doctor || !this.appointment.doctor._id) {
      console.error('Invalid appointment or doctor data:', this.appointment);
      await this.showAlert('Error', 'Appointment or doctor data is incomplete.');
      return;
    }

    if (!this.patientId) {
      console.error('Patient ID is missing');
      await this.showAlert('Error', 'You must be logged in to confirm an appointment.');
      return;
    }


    const appointmentData = {
      date: this.appointment.date,
      reason: this.appointment.reason || 'General Consultation',
      time: this.appointment.time,
      location: this.appointment.location,
      doctor_id: this.appointment.doctor._id,
      patient_id: this.patientId,
      status: 'pending'
    };
    console.log('Posting appointment:', appointmentData);

    this.appointmentService.postAppointment(appointmentData).subscribe(
      async response => {
        console.log('Appointment posted successfully:', response);
        await this.showAlert('Success', 'Appointment confirmed successfully.');
      },
      async error => {
        console.error('Error posting appointment:', error);
        await this.showAlert('Error', 'Failed to confirm appointment.');
      }
    );
    this.router.navigate(['/home']);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
