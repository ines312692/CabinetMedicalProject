import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { DatePipe, NgIf} from '@angular/common';
import {IonicModule, AlertController} from '@ionic/angular';
import { AppointmentService } from '../../services/appointmentservice.service';

@Component({
  selector: 'app-appointment-confirmation',
  templateUrl: './appointment-confirmation.page.html',
  standalone: true,
  imports: [IonicModule, NgIf],
  providers: [DatePipe],
  styleUrls: ['./appointment-confirmation.page.scss']
})
export class AppointmentConfirmationPage implements OnInit {
  appointment: any; // Consider typing as Appointment & { doctor: Doctor }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly doctorService: DoctorService,
    private readonly datePipe: DatePipe,
    private readonly appointmentService: AppointmentService,
    private readonly alertController: AlertController
  ) {}

  ngOnInit() {
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

    // Validate appointment and doctor
    if (!this.appointment || !this.appointment.doctor || !this.appointment.doctor._id) {
      console.error('Invalid appointment or doctor data:', this.appointment);
      await this.showAlert('Error', 'Appointment or doctor data is incomplete.');
      return;
    }

   

    // Prepare appointment data
    const appointmentData = {
      date: this.appointment.date,
      reason: this.appointment.reason || 'General Consultation',
      time: this.appointment.time,
      location: this.appointment.location,
      doctor_id: this.appointment.doctor._id, // Use _id (string) from Doctor interface
      patient_id: this.appointment.doctor._id, // TODO: Replace with actual patient ID after authentication
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
