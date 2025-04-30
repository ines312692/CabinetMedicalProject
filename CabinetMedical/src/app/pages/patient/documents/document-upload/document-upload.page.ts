import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { IonicModule } from "@ionic/angular";
import { NgIf } from "@angular/common";
import { AuthService } from '../../../../services/auth.service';

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
export class DocumentUploadPage implements OnInit {
  @Input() doctorId: string = '';
  @Output() documentUploaded = new EventEmitter<any>();

  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  uploadProgress: number = -1;
  uploadPercentage: number = 0;
  patientId: string = '';

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Get patient ID from the authenticated user
    this.getPatientId();
  }

  getPatientId() {
    // Get the current user/patient ID
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.patientId = typeof currentUser.id === 'object'
        ? (currentUser.id as any).$oid
        : currentUser.id;
    }
  }

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
      this.showAlert('No file selected!', 'error-alert');
      return;
    }

    if (!this.patientId) {
      this.showAlert('Patient ID not available', 'error-alert');
      return;
    }

    if (!this.doctorId) {
      this.showAlert('Doctor ID not available', 'error-alert');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('patient_id', this.patientId);
    formData.append('doctor_id', this.doctorId);
    formData.append('status', 'not viewed'); // Default status

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
        this.showAlert('Send complete!', 'success-alert');
        this.documentUploaded.emit(event.body);
        this.selectedFile = null;
        this.selectedFileName = null;
        console.log('Upload complete', event.body);
      }
    }, error => {
      this.uploadProgress = -1;
      this.uploadPercentage = 0;
      this.showAlert('Send failed!', 'error-alert');
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
