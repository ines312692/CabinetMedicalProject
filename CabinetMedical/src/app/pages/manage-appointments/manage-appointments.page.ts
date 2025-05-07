import { Component, Input, OnInit } from '@angular/core';
import { Appointment } from '../../models/Appointment.interface';
import {ActivatedRoute,Router} from '@angular/router';
import { AppointmentService } from '../../services/appointmentservice.service';
import { CommonModule } from '@angular/common';
import { AlertController, IonicModule } from '@ionic/angular';
import { Patient } from '../../models/Patient.interface';
import { PatientService } from '../../services/patient.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-manage-appointments',
  templateUrl: './manage-appointments.page.html',
  styleUrls: ['./manage-appointments.page.scss'],
  imports: [CommonModule, IonicModule,],
  standalone: true
})
export class ManageAppointmentsPage implements OnInit {
  appointments: Appointment[] = [];
  isLoading = false;
  @Input() doctorId: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly appointmentService: AppointmentService,
    private readonly alertController: AlertController,
    private readonly patientService: PatientService,
    private readonly router: Router
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
      next: (appointmentsData) => {
        const uniquePatientIds = Array.from(
          new Set(appointmentsData.map((appt: Appointment) =>
            typeof appt.patient_id === 'string' ? appt.patient_id : appt.patient_id.$oid
          ))
        );

        const patientRequests = uniquePatientIds.map(id =>
          this.patientService.getPatientDetails(id)
        );

        forkJoin(patientRequests).subscribe({
          next: (patients) => {
            const patientMap = new Map<string, Patient>();
            patients.forEach(p => patientMap.set(p._id, p));
            this.appointments = appointmentsData.map((appt: Appointment) => {
              const patientId = typeof appt.patient_id === 'string' ? appt.patient_id : appt.patient_id.$oid;
              const patient = patientMap.get(patientId);
              return {
                ...appt,
                patientName: patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown'
              };
            });

            this.isLoading = false;
          },
          error: (err) => {
            console.error('Failed to load patient details:', err);
            this.isLoading = false;
            this.showAlert('Error', 'Failed to load patient information');
          }
        });
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

  async viewUserDetails(patientId: { $oid: string } | string): Promise<void> {
    console.log('Received patientId:', patientId);

    const id = typeof patientId === 'string' ? patientId : patientId.$oid;

    if (!id) {
      console.error('Patient ID is missing');
      return;
    }

    this.router.navigate(['/details-patient', id]);
  }


}
