import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Appointment } from '../models/Appointment.interface';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly apiUrl = 'http://localhost:5000';

  constructor(private readonly http: HttpClient) {}

  getDoctorAppointments(doctorId: string): Observable<Appointment[]> {
    return this.http.get<any[]>(`${this.apiUrl}/doctors/${doctorId}/appointments`).pipe(
      map(appointments => appointments.map(app => ({
        ...app,
        _id: app._id?.$oid || app._id, // Handle both formats
        doctor_id: app.doctor_id?.$oid || app.doctor_id,
        patient_id: app.patient_id?.$oid || app.patient_id
      })))
    );
  }

  acceptAppointment(id: { $oid: string }): Observable<any> {
    if (!id) throw new Error('Appointment ID is required');
    return this.http.put(`${this.apiUrl}/appointments/${id}/accept`, {});
  }

  rejectAppointment(id: { $oid: string }): Observable<any> {
    if (!id) throw new Error('Appointment ID is required');
    return this.http.put(`${this.apiUrl}/appointments/${id}/reject`, {});
  }
  postAppointment(appointment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/appointments`, appointment);
  }

  getAppointmentsByPatient(patientId: string): Observable<any> {
    return this.http.get(`http://localhost:5000/patient/${patientId}/appointments`);
  }
}
