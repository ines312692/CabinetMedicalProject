import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Doctor } from '../../models/Docter.interface';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';

import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import {CalenderPage} from "../calender/calender.page";

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.page.html',
  styleUrls: ['./doctor-details.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    CalenderPage,
  ]
})
export class DoctorDetailsPage implements OnInit {
  doctor!: Doctor;

  constructor(private route: ActivatedRoute, private doctorService: DoctorService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.doctorService.getDoctorById(id).subscribe(doctor => {
      this.doctor = doctor;
      setTimeout(() => {
        this.loadMap();
      }, 100); // Delay to ensure the DOM is fully loaded
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
}
