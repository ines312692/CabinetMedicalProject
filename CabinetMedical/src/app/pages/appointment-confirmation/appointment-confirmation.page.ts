// appointment-confirmation.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../services/appointmentservice.service';
import { Appointment } from '../../models/Appointment.interface';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import {IonicModule} from "@ionic/angular";
import {NgIf} from "@angular/common";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-appointment-confirmation',
  templateUrl: './appointment-confirmation.page.html',
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    DatePipe
  ],
  styleUrls: ['./appointment-confirmation.page.scss']
})
export class AppointmentConfirmationPage implements OnInit {
  appointment!: Appointment;

  constructor(private route: ActivatedRoute, private appointmentService: AppointmentService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.appointmentService.getAppointmentById(id).subscribe(appointment => {
      this.appointment = appointment;
      setTimeout(() => {
        this.loadMap();
      }, 100); // Delay to ensure the DOM is fully loaded
    });
  }

  loadMap() {
    const mapElement = document.getElementById('map');
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
        center: fromLonLat([this.appointment.location.longitude, this.appointment.location.latitude]),
        zoom: 15,
      }),
    });

    const markerElement = document.createElement('div');
    markerElement.className = 'marker';
    const marker = new Overlay({
      position: fromLonLat([this.appointment.location.longitude, this.appointment.location.latitude]),
      positioning: 'center-center',
      element: markerElement,
      stopEvent: false,
    });
    map.addOverlay(marker);
  }

  confirmAppointment() {
      console.log('Appointment confirmed');
  }
}
