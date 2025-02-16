import { Component } from '@angular/core';

import {IonicModule} from "@ionic/angular";
import {FileUploadModule} from "ng2-file-upload";

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.page.html',
  styleUrls: ['./document-upload.page.scss'],
  imports: [
    IonicModule,
    FileUploadModule,
  ],
  standalone: true
})
export class DocumentUploadPage {


  constructor() {}


}
