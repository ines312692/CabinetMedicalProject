import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../models/Appointment.interface';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../services/appointmentservice.service';
import {NgClass, NgForOf} from '@angular/common';
import { AlertController, IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-manage-appointments',
  templateUrl: './manage-appointments.page.html',
  styleUrls: ['./manage-appointments.page.scss'],
  imports: [NgForOf,  IonicModule,  NgClass],
  standalone: true
})
export class ManageAppointmentsPage implements OnInit {
  appointments: Appointment[] = [];
  doctorId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.doctorId = this.route.snapshot.paramMap.get('doctor_id');
    console.log('Doctor ID:', this.doctorId);
    this.loadAppointments();
  }

  loadAppointments(): void {
    if (!this.doctorId) {
      console.error('Doctor ID is missing');
      return;
    }

    this.appointmentService.getDoctorAppointments(this.doctorId).subscribe({
      next: (data) => {
        console.log('Appointments data:', data);
        this.appointments = data;
        this.appointments.forEach(appointment => {
          console.log('Appointment ID:', appointment._id);
        });
      },
      error: (error) => {
        console.error('Error fetching appointments', error);
        this.showAlert('Error', 'Failed to load appointments').then(r => console.log(r));
      }
    });
  }

  async acceptAppointment(appointment: Appointment): Promise<void> {
    console.log('Appointment object:', appointment);
    const appointmentId = appointment._id;
    if (!appointmentId) {
      console.error('Appointment ID is missing');
      return;
    }
    console.log('id appointment:', appointmentId);
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
                this.loadAppointments();
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
    console.log('Appointment object:', appointment);
    const appointmentId = appointment._id;
    if (!appointmentId) {
      console.error('Appointment ID is missing');
      return;
    }
    console.log('id appointment:', appointmentId);
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
                this.loadAppointments();
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
