import {Component, Input, OnInit} from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import {Doctor} from "../../models/Docter.interface";
import {DoctorCardPage} from "../doctor-card/doctor-card.page";
import {IonicModule} from "@ionic/angular";
import {NgForOf} from "@angular/common";


@Component({
  selector: 'app-doctor-grid',
  templateUrl: './doctor-grid.page.html',
  styleUrls: ['./doctor-grid.page.scss'],
  standalone: true,
  imports: [
    DoctorCardPage,
    IonicModule,
    NgForOf
  ]
})
export class DoctorGridPage implements OnInit {
  @Input() doctors: Doctor[] = [];

currentUserId: string = localStorage.getItem('userId') || '';

  constructor(private doctorService: DoctorService) { }

 
  ngOnInit() {
    this.doctorService.getDoctors().subscribe(doctors => {
      this.doctors = doctors.filter(doctor => doctor.id != this.currentUserId);
    });
  }
  
}
