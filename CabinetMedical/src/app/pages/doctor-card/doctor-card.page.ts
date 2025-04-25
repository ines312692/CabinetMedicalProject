// doctor-card.page.ts
import { Component, Input, OnInit } from '@angular/core';
import {Doctor} from "../../models/Docter.interface";
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";


@Component({
  selector: 'app-doctor-card',
  templateUrl: './doctor-card.page.html',
  styleUrls: ['./doctor-card.page.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class DoctorCardPage implements OnInit {
  @Input() doctor!: Doctor;

  constructor(private readonly router: Router) { }

  ngOnInit() {

  }
  viewDoctorDetails() {
    // Implémentez la navigation vers les détails du docteur
  }
  bookAppointment() {
    if (!this.doctor?._id) {
      console.error('Doctor ID is undefined');
      return;
    }
    const doctorId = this.doctor._id.$oid; // Extract the $oid string
    this.router.navigate(['/doctor-details', doctorId]);
  }


  callDoctor() {
    // Logique pour appeler le docteur
  }


}
