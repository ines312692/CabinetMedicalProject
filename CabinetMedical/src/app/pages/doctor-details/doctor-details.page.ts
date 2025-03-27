import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgForOf, NgStyle } from '@angular/common';
import { Doctor } from '../../models/Docter.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.page.html',
  styleUrls: ['./doctor-details.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    NgForOf,
    NgStyle,
    FormsModule,
  ]
})
export class DoctorDetailsPage implements OnInit {
  doctor!: Doctor;
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedTime: string | undefined;
  availableTimes: string[] = [];
  isModalOpen = false;
  isDateCardVisible = true;

  constructor(private route: ActivatedRoute, private doctorService: DoctorService, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.doctorService.getDoctorById(id).subscribe(doctor => {
      this.doctor = doctor;
      this.isDateCardVisible = true;
      setTimeout(() => {
        this.loadMap();
      }, 100);
    });
  }

  loadMap() {
    const mapElement = document.getElementById('map');
    console.log('Map element:', mapElement);

    if (!mapElement) {
      console.error('Map element not found');
      return;
    }

    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([this.doctor.longitude, this.doctor.latitude]),
        zoom: 15,
      }),
    });

    const markerElement = document.createElement('div');
    markerElement.className = 'marker';
    const marker = new Overlay({
      position: fromLonLat([this.doctor.longitude, this.doctor.latitude]),
      positioning: 'center-center',
      element: markerElement,
      stopEvent: false,
    });
    map.addOverlay(marker);
  }

  isAvailable(day: string): boolean {
    return this.doctor.availability.some(slot => slot.day === day);
  }

  getHours(day: string): string[] {
    const slot = this.doctor.availability.find(slot => slot.day === day);
    return slot ? slot.hours : [];
  }

  bookAppointment() {
    console.log('Selected Time:', this.selectedTime);
    if (this.selectedTime) {
      const appointmentDetails = {
        doctor: this.doctor,
        service: 'General Consultation',
        date: new Date().toISOString().split('T')[0], // Current date
        time: this.selectedTime,
        location: { latitude: this.doctor.latitude, longitude: this.doctor.longitude }
      };
      this.doctorService.saveAppointmentDetails(appointmentDetails);
      this.isDateCardVisible = false;
      this.isModalOpen = false;
      this.router.navigate(['/appointment-confirmation'], {queryParams: {appointmentId: this.doctor.id.toString()}}).then(r =>console.log('Navigated to appointment confirmation page'));
      this.closeBookingModal();
    } else {
      alert('Please select a valid time for the appointment.');
    }
  }

  openBookingModal(day: string) {
    if (this.isAvailable(day)) {
      this.availableTimes = this.getHours(day);
      this.isModalOpen = true;
    }
  }

  closeBookingModal() {
    this.isModalOpen = false;
  }

  handleModalChange(event: any) {
    this.isModalOpen = event.detail.isOpen;
  }
}
