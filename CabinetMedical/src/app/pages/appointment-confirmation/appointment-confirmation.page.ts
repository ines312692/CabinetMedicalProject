import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../services/appointmentservice.service';
import { Appointment } from '../../models/Appointment.interface';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import {NgIf} from "@angular/common";
import { DatePipe } from '@angular/common';
import { DoctorService } from '../../services/doctor.service';
import { IonicModule, AlertController } from "@ionic/angular";



@Component({
  selector: 'app-appointment-confirmation',
  templateUrl: './appointment-confirmation.page.html',
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    DatePipe
  ],
  providers: [DatePipe],
  styleUrls: ['./appointment-confirmation.page.scss']
})
export class AppointmentConfirmationPage implements OnInit {
  appointment: any;

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private datePipe: DatePipe,
    private appointmentService: AppointmentService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log('Params:', params);
      if (params['appointmentId']) {
        this.appointment = this.doctorService.getAppointmentDetails();
        if (this.appointment) {
          console.log('Appointment details:', this.appointment);
        } else {
          console.log('Appointment details not found');
        }
      }
    });
  }

  getFormattedDate(date: string): string {
    return this.datePipe.transform(date, 'fullDate') || '';
  }

  async confirmAppointment() {
    console.log('Appointment confirmed:', this.appointment);

    const appointmentData = {
      date: this.appointment.date,
      reason: this.appointment.reason || 'General Consultation',
      time: this.appointment.time,
      location: this.appointment.location,
      doctor_id: String(this.appointment.doctor.id.$oid),
      patient_id:String(this.appointment.doctor.id.$oid),/*****a changer lorsque le client fait authentification */
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
