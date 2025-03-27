// doctor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/Docter.interface';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://127.0.0.1:5000/doctors';
  private appointmentDetails: any;

  constructor(private http: HttpClient) {}

  saveAppointmentDetails(details: any) {
    this.appointmentDetails = details;
  }

  getAppointmentDetails() {
    return this.appointmentDetails;
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }
}
