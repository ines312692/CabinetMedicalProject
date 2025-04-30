// Fixed ManageAppointmentsPage Component
import { Component, Input, OnInit } from '@angular/core';
import { Appointment } from '../../models/Appointment.interface';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../services/appointmentservice.service';
import { CommonModule } from '@angular/common';
import { AlertController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-manage-appointments',
  templateUrl: './manage-appointments.page.html',
  styleUrls: ['./manage-appointments.page.scss'],
  imports: [CommonModule, IonicModule],
  standalone: true
})
export class ManageAppointmentsPage implements OnInit {
  appointments: Appointment[] = [];
  isLoading = false;
  @Input() doctorId: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly appointmentService: AppointmentService,
    private readonly alertController: AlertController
  ) {}

  ngOnInit() {
    if (!this.doctorId) {
      this.doctorId = this.route.snapshot.paramMap.get('doctor_id');
    }

    console.log('Doctor ID for appointments:', this.doctorId);
    this.loadAppointments();
  }


  loadAppointments(): void {
    if (!this.doctorId) {
      console.error('Doctor ID is missing');
      return;
    }

    this.isLoading = true;
    this.appointmentService.getDoctorAppointments(this.doctorId).subscribe({
      next: (data) => {
        console.log('Appointments data:', data);
        this.appointments = data;
        this.isLoading = false;

        // Debug appointments data
        if (this.appointments.length > 0) {
          console.log('First appointment details:', JSON.stringify(this.appointments[0]));
        } else {
          console.log('No appointments found for this doctor');
        }
      },
      error: (error) => {
        console.error('Error fetching appointments', error);
        this.isLoading = false;
        this.showAlert('Error', 'Failed to load appointments');
      }
    });
  }

  async acceptAppointment(appointment: Appointment): Promise<void> {
    console.log('Accepting appointment:', appointment);
    const appointmentId = appointment._id;
    if (!appointmentId) {
      console.error('Appointment ID is missing');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'Accept this appointment?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'OK',
          handler: () => {
            this.appointmentService.acceptAppointment(appointmentId).subscribe({
              next: () => {
                // Update the appointment status locally for immediate UI update
                appointment.status = 'accepted';
                this.showAlert('Success', 'Appointment accepted successfully');
              },
              error: (err) => {
                console.error(err);
                this.showAlert('Error', 'Failed to accept appointment');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async rejectAppointment(appointment: Appointment): Promise<void> {
    console.log('Rejecting appointment:', appointment);
    const appointmentId = appointment._id;
    if (!appointmentId) {
      console.error('Appointment ID is missing');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'Reject this appointment?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'OK',
          handler: () => {
            this.appointmentService.rejectAppointment(appointmentId).subscribe({
              next: () => {
                // Update the appointment status locally for immediate UI update
                appointment.status = 'rejected';
                this.showAlert('Success', 'Appointment rejected successfully');
              },
              error: (err) => {
                console.error(err);
                this.showAlert('Error', 'Failed to reject appointment');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
