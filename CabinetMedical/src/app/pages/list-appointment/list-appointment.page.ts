import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppointmentService } from "../../services/appointmentservice.service";
import { IonicModule } from "@ionic/angular";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: 'app-list-appointment',
  templateUrl: './list-appointment.page.html',
  styleUrls: ['./list-appointment.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgForOf,
    NgClass
  ]
})
export class ListAppointmentPage implements OnInit, OnChanges {
  @Input() patientId: string = '';

  appointments: any[] = [];

  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    if (this.patientId) {
      console.log('Patient ID:', this.patientId);
      this.loadAppointments();

    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['patientId'] && changes['patientId'].currentValue) {
      this.loadAppointments();
    }
  }

  loadAppointments() {
    this.appointmentService.getAppointmentsByPatient(this.patientId).subscribe(
      (response) => {
        // Vérifiez si la réponse contient un tableau
        this.appointments = response.appointments || [];
        console.log('Appointments:', this.appointments);
      },
      (error) => {
        console.error('Erreur lors du chargement des rendez-vous :', error);
      }
    );
  }
  viewAppointmentDetails(appointment: any) {
    this.router.navigate(['/appointment-details'], { state: { appointment } });
  }
}
