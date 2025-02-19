// doctor-card.page.ts
import { Component, Input, OnInit } from '@angular/core';
import {Doctor} from "../../models/Docter.interface";
import {IonicModule} from "@ionic/angular";


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

  constructor() { }

  ngOnInit() {
  }
}
