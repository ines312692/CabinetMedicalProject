import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.page.html',
  styleUrls: ['./document-list.page.scss'],
  imports: [
    IonicModule
  ],
  standalone: true
})
export class DocumentListPage implements OnInit {
  constructor() {
  }
  ngOnInit() {
  }
}
