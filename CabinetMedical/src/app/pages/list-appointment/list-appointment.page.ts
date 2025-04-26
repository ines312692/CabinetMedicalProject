import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from "../../services/appointmentservice.service";
import { IonicModule } from "@ionic/angular";
import {NgClass, NgForOf} from "@angular/common";

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
export class ListAppointmentPage implements OnInit {
  appointments: any[] = [];
  patientId: string = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('patient_id') || '';
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.getAppointmentsByPatient(this.patientId).subscribe(
      (response) => {
        // Vérifiez si la réponse contient un tableau
        this.appointments = response.appointments || [];
      },
      (error) => {
        console.error('Erreur lors du chargement des rendez-vous :', error);
      }
    );
  }
}
