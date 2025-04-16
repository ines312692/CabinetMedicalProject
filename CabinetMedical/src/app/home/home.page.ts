import { Component, OnDestroy, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { Doctor } from '../models/Docter.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false  // Remove or set to false
})
export class HomePage implements OnInit, OnDestroy {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  currentDoctorIndex: number = 0;
  intervalId: any;
  private doctorsSubscription!: Subscription;

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.loadDoctors();
    this.startImageRotation();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.doctorsSubscription) {
      this.doctorsSubscription.unsubscribe();
    }
  }

  loadDoctors() {
    this.doctorsSubscription = this.doctorService.getDoctors().subscribe({
      next: (data: Doctor[]) => {
        this.doctors = data;
        this.filteredDoctors = [...data];
        console.log('Médecins récupérés :', this.doctors);
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération des médecins', error);
      }
    });
  }

  startImageRotation() {
    this.intervalId = setInterval(() => {
      if (this.filteredDoctors.length > 0) {
        this.currentDoctorIndex = (this.currentDoctorIndex + 1) % this.filteredDoctors.length;
      }
    }, 3000);
  }

  swiperSlideChanged(e: any) {
    console.log('slide changed', e);
  }

  searchDoctors(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredDoctors = this.doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(query) ||
      (doctor.specialty && doctor.specialty.toLowerCase().includes(query))
    );
  }
}