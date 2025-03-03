import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService {
  private baseUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  getPatientHistory(patientId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/patient/${patientId}/history`);
  }

  getPatientDiagnostics(patientId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/patient/${patientId}/diagnostics`);
  }
}
