import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.page.html',
  styleUrls: ['./patient-profile.page.scss'],
  imports: [
    IonicModule
  ],
  standalone: true,
})
export class PatientProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
