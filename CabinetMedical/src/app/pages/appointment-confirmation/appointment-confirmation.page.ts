import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { DatePipe } from '@angular/common';
import { IonicModule } from "@ionic/angular";
import { NgIf } from "@angular/common";

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

  constructor(private route: ActivatedRoute, private doctorService: DoctorService, private datePipe: DatePipe) {}

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
  }
}
