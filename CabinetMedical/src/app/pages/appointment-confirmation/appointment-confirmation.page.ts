import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { DatePipe } from '@angular/common';
import { IonicModule } from "@ionic/angular";
import { NgIf } from "@angular/common";
import {AppointmentService} from "../../services/appointmentservice.service";

@Component({
  selector: 'app-appointment-confirmation',
  templateUrl: './appointment-confirmation.page.html',
  standalone: true,
  imports: [
    IonicModule,
    NgIf
  ],
  providers: [DatePipe],
  styleUrls: ['./appointment-confirmation.page.scss']
})
export class AppointmentConfirmationPage implements OnInit {
  appointment: any;

  constructor(private route: ActivatedRoute, private doctorService: DoctorService, private datePipe: DatePipe,private appointmentService: AppointmentService) {}

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

  confirmAppointment() {
    console.log('Appointment confirmed:', this.appointment);

    const appointmentData = {
      date: this.appointment.date,
      reason: this.appointment.reason || 'General Consultation',
      time: this.appointment.time,
      location: this.appointment.location,
      doctor_id: String(this.appointment.doctor.$oid),
      patient_id: "patient_id_placeholder", // Replace with actual patient ID
      status: 'pending'
    };

    this.appointmentService.postAppointment(appointmentData).subscribe(
      response => {
        console.log('Appointment posted successfully:', response);
        // Handle successful response, e.g., navigate to a confirmation page
      },
      error => {
        console.error('Error posting appointment:', error);
        // Handle error response
      }
    );
  }
}
