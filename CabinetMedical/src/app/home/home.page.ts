import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  doctors: any[] = [];
  constructor(private route: ActivatedRoute, private doctorService: DoctorService) {}
  swiperSlideChanged(e:any) {
    console.log('slide changed', e);
  }
  ngOnInit() {
    this.loadDoctors();
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
}
