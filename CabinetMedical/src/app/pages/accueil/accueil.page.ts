import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.page.html',
  styleUrls: ['./accueil.page.scss'],
  imports: [
    IonicModule
  ],
  standalone: true
})
export class AccueilPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
