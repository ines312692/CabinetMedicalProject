import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  imports: [
    IonicModule
  ],
  standalone: true
})
export class TabsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
