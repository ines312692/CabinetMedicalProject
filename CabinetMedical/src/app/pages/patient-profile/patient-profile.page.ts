import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import {IonicModule} from "@ionic/angular";
=======
>>>>>>> a1466ef77d73bc0405defc76acdad8d677bc86da

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.page.html',
  styleUrls: ['./patient-profile.page.scss'],
<<<<<<< HEAD
  imports: [
    IonicModule
  ],
  standalone: true
=======
  standalone: false
>>>>>>> a1466ef77d73bc0405defc76acdad8d677bc86da
})
export class PatientProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
