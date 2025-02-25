import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DoctorService} from "../services/doctor.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  doctors: any[] = [];
  currentDoctorIndex: number = 0;
  intervalId: any;

  constructor(private route: ActivatedRoute, private doctorService: DoctorService) {}

  ngOnInit() {
    this.loadDoctors();
    this.startImageRotation();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadDoctors() {
    this.doctorService.getDoctors().subscribe(
      (data) => {
        this.doctors = data;
        console.log('Médecins récupérés :', this.doctors);
      },
      (error) => {
        console.error('Erreur lors de la récupération des médecins', error);
      }
    );
  }

  startImageRotation() {
    this.intervalId = setInterval(() => {
      this.currentDoctorIndex = (this.currentDoctorIndex + 1) % this.doctors.length;
    }, 3000); // Change image every 3 seconds
  }
}
