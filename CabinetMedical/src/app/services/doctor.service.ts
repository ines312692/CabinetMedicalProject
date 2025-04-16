import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Doctor } from '../models/Docter.interface';
import { Appointment } from '../models/Appointment.interface';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private apiUrl = 'http://localhost:5000/doctors'; // Added '/doctors' to base path

  constructor(private http: HttpClient) {}

  getDoctorDetails(doctorId: string): Observable<Doctor> {
    return this.http.get<any>(`${this.apiUrl}/${doctorId}`).pipe(
      map(doctor => ({
        ...doctor,
        _id: doctor._id?.$oid || doctor._id
      }))
    );
  }

  getDoctorAppointments(doctorId: string): Observable<Appointment[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${doctorId}/appointments`).pipe(
      map(appointments => appointments.map(app => ({
        ...app,
        _id: app._id?.$oid || app._id,
        doctor_id: app.doctor_id?.$oid || app.doctor_id,
        patient_id: app.patient_id?.$oid || app.patient_id
      })))
    );
  }

  updateDoctorProfile(doctorId: string, data: Partial<Doctor>): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/${doctorId}`, data);
  }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(doctors => doctors.map(doctor => ({
        ...doctor,
        _id: doctor._id?.$oid || doctor._id
      })))
    );
  }
  
  getDoctorById(id: string): Observable<Doctor> {
    return this.getDoctorDetails(id); // Reuse existing method
  }
}