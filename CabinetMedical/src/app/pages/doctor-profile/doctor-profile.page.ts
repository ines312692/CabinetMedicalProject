import { Component, OnInit } from '@angular/core';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import { Doctor } from '../../models/Docter.interface';
import { DoctorService } from 'src/app/services/doctor.service';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ManageAppointmentsPage } from '../manage-appointments/manage-appointments.page';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.page.html',
  styleUrls: ['./doctor-profile.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    FormsModule,
    ManageAppointmentsPage,
    NgForOf,
    NgStyle
  ]
})
export class DoctorProfilePage implements OnInit {
  doctorDetails: Doctor | null = null;
  isLoadingDoctor = false;
  selectedTab = 'manage-appointments';
  doctorId: string | null = null;
  doctorFiles: any[] = [];

  constructor(
    private readonly doctorService: DoctorService,
    private readonly route: ActivatedRoute,
    private readonly http: HttpClient
  ) {}

  ngOnInit() {
    this.doctorId = this.route.snapshot.paramMap.get('doctor_id');
    if (this.doctorId) {
      this.loadDoctorData(this.doctorId);
      this.loadDoctorFiles(); // Appelé après avoir défini doctorId
    } else {
      console.error('No doctor ID found in route');
    }
  }

  private loadDoctorData(doctorId: string) {
    this.isLoadingDoctor = true;
    this.doctorService.getDoctorById(doctorId).subscribe({
      next: (data: Doctor) => {
        this.doctorDetails = data;
        this.isLoadingDoctor = false;
      },
      error: (err) => {
        console.error('Error loading doctor details:', err);
        this.isLoadingDoctor = false;
      }
    });
  }
  loadDoctorFiles() {
    this.http.get<any[]>(`http://localhost:5000/${this.doctorId}/files`).subscribe((files) => {
      this.doctorFiles = files;
      console.log('Doctor files:', this.doctorFiles);
    });
  }
  downloadFile(file: any) {
    this.http.put(`http://localhost:5000/update-file-status/${file.id}`, { status: 'view' }).subscribe({
      next: () => {
        // Télécharger le fichier après la mise à jour du statut
        window.open(`http://localhost:5000/uploads/${file.filename}`, '_blank');
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut du fichier :', err);
      }
    });
  }
}
