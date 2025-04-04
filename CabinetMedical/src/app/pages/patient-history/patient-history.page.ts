import { Component, OnInit } from '@angular/core';
import { MedicalHistoryService } from 'src/app/services/medical-history.service';
import { ActivatedRoute } from '@angular/router';
import {IonicModule} from "@ionic/angular";
import {NgForOf, NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.page.html',
  styleUrls: ['./patient-history.page.scss'],
  imports: [
    IonicModule,
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class PatientHistoryPage implements OnInit {
  patientId: string;
  history: any;
  diagnostics: any;

  constructor(
    private medicalHistoryService: MedicalHistoryService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.patientId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.loadHistory();
    this.loadDiagnostics();
  }

  loadHistory() {
    this.medicalHistoryService.getPatientHistory(this.patientId).subscribe(data => {
      this.history = data;
    });
  }

  loadDiagnostics() {
    this.medicalHistoryService.getPatientDiagnostics(this.patientId).subscribe(data => {
      this.diagnostics = data;
    });
  }
  downloadDiagnosticsPdf() {
    const url = `http://127.0.0.1:5000/patient/${this.patientId}/diagnostics/pdf`;
    this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
      saveAs(blob, 'diagnostics.pdf');
    });
  }
}
