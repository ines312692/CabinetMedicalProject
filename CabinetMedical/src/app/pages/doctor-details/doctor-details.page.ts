import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import { IonicModule, AlertController } from '@ionic/angular';
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
  daysOfWeek: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  selectedTime: string | undefined;
  availableTimes: string[] = [];
  isDateCardVisible = true;
  idCurrentUser: string = localStorage.getItem('userId') || '';



  constructor(private readonly route: ActivatedRoute, private readonly doctorService: DoctorService, private readonly router: Router, private readonly alertController: AlertController) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.doctorService.getDoctorById(id).subscribe( doctor => {

      // 1) si availability est JSON sérialisé, on parse
      if (typeof doctor.availability === 'string') {
        try {
          doctor.availability = JSON.parse(doctor.availability);
        } catch {
          doctor.availability = [];
        }
      }

      // 2) on normalise chaque slot.hours en véritable string[]
      doctor.availability = (doctor.availability || []).map(slot => {
        // on “oublie” le type statique string[]
        const raw: unknown = (slot as any).hours;

        let hoursArray: string[];
        if (typeof raw === 'string') {
          // soit c’est du JSON, soit du “09:00,14:00”
          try {
            hoursArray = JSON.parse(raw);
          } catch {
            hoursArray = raw.split(',').map(h => h.trim());
          }
        } else if (Array.isArray(raw)) {
          hoursArray = raw as string[];
        } else {
          hoursArray = [];
        }

        return {
          day: slot.day,
          hours: hoursArray
        };
      });

      this.doctor = doctor;
      setTimeout(() => this.loadMap(), 100);
    });
  }


  openConversation() {

    const senderId = this.idCurrentUser;  // Assure-toi que ton token contient bien user_id
    const receiverId = this.doctor._id;

    this.router.navigate(['/conversation', senderId, receiverId]);
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
    return this.doctor.availability?.some(slot => slot.day == day) ?? false;
  }

  getHours(day: string): string[] {
    const slot = this.doctor.availability.find(slot => slot.day == day);
    return slot ? slot.hours: [];
  }

  async openBookingModal(day: string) {
    if (this.isAvailable(day)) {
      this.availableTimes = this.getHours(day);
      const alert = await this.alertController.create({
        header: 'Select Time',
        inputs: this.availableTimes.map(time => ({
          type: 'radio',
          label: time,
          value: time
        })),
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Confirm Cancel');
            }
          },
          {
            text: 'OK',
            handler: (selectedTime) => {
              this.selectedTime = selectedTime;
              this.bookAppointment();
            }
          }
        ]
      });

      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Aucune disponibilité',
        message: 'Veuillez choisir un autre créneau horaire.',
        buttons: ['OK']
      });

      await alert.present();
    }
  }

  bookAppointment() {
    console.log('Selected Time:', this.selectedTime);
    if (this.selectedTime) {
      const appointmentDetails = {
        doctor: this.doctor,
        service: 'Consultation générale',
        date: new Date().toISOString().split('T')[0],
        time: this.selectedTime,
        location: { latitude: this.doctor.latitude, longitude: this.doctor.longitude }
      };
      this.doctorService.saveAppointmentDetails(appointmentDetails);
      this.isDateCardVisible = false;


      const doctorId = this.doctor._id ;
      // @ts-ignore
      this.router.navigate(['/appointment-confirmation'], {
        queryParams: {appointmentId: doctorId.toString()}
      }).then(r => console.log('Navigated to appointment confirmation page'));
    } else {
      alert('Veuillez choisir un horaire valide.');
    }
  }
}
