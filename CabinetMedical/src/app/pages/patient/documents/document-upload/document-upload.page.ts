import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { IonicModule } from "@ionic/angular";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.page.html',
  styleUrls: ['./document-upload.page.scss'],
  imports: [
    IonicModule,
    NgIf,
  ],
  standalone: true
})
export class DocumentUploadPage {
  @Output() documentUploaded = new EventEmitter<any>();
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  uploadProgress: number = -1;
  uploadPercentage: number = 0;

  constructor(private http: HttpClient, private alertController: AlertController) {}

  async showAlert(message: string, cssClass: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      cssClass: cssClass,
      buttons: ['OK']
    });
    await alert.present();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  onUpload() {
    if (!this.selectedFile) {
      this.showAlert('No file selected!', 'error-alert').then(r => console.log(r));
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://127.0.0.1:5000/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        if (event.total) {
          this.uploadProgress = event.loaded / event.total;
          this.uploadPercentage = Math.round((event.loaded / event.total) * 100);
        }
      } else if (event.type === HttpEventType.Response) {
        this.uploadProgress = -1;
        this.uploadPercentage = 0;
        this.showAlert('Send complete!', 'success-alert').then(r => console.log(r));
        this.documentUploaded.emit(event.body);
        console.log('Upload complete', event.body);
      }
    }, error => {
      this.uploadProgress = -1;
      this.uploadPercentage = 0;
      this.showAlert('send failed!', 'error-alert').then(r => console.log(r));
      console.error('Upload failed', error);
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }
}
