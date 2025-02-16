import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.page.html',
  styleUrls: ['./document-view.page.scss'],
  imports: [
    IonicModule
  ],
  standalone: true
})
export class DocumentViewPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
