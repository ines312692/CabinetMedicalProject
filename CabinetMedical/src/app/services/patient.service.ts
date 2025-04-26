import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
 // Create these interfaces

import { catchError, map } from 'rxjs/operators';
import {Appointment, Consultation, Patient} from "../models/Patient.interface";

@Injectable({ providedIn: 'root' })
export class PatientService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  getPatientDetails(patientId: string): Observable<Patient> {
    const baseHref = document.baseURI;
    return this.http.get<any>(`${this.apiUrl}/patients/${patientId}`).pipe(
      map(patient => ({
        _id: patient._id,
        first_name: patient.first_name,
        last_name: patient.last_name,
        birth_date: patient.birth_date,
        email: patient.email,
        role: patient.role,
        address: patient.address || undefined,
        phone: patient.phone || undefined,
        //image: patient.image ? '../assets/img/' + patient.image + '.png' : '../assets/img/default-avatar.png',
        image: patient.image || 'default-avatar.png',
        //image: `${baseHref}../assets/images/${patient.image || 'default-avatar.png'}`,
        allergies: patient.allergies || []
      }))
    );
  }

  // patient.service.ts
  getPatientHistory(patientId: string): Observable<History> {
    // @ts-ignore
    return this.http.get<any>(`${this.apiUrl}/patients/${patientId}/history`).pipe(
      map(response => ({
        appointments: response.appointments.map((app: any) => ({
          _id: app._id,
          date: app.date,
          reason: app.reason,
          time: app.time || '',
          status: app.status || 'scheduled',
          doctor_id: app.doctor_id,
          patient_id: app.patient_id
        })),
        consultations: response.consultations.map((con: any) => ({
          _id: con._id,
          date: con.date,
          notes: con.notes,
          doctor_id: con.doctor_id,
          patient_id: con.patient_id
        }))
      })),
      catchError(error => {
        console.error('Error fetching history:', error);
        return of({
          appointments: [],
          consultations: []
        });
      })
    );
  }

  private transformAppointment(appointment: any): Appointment {
    return {
      ...appointment,
      _id: appointment._id?.$oid || appointment._id,
      doctor_id: appointment.doctor_id?.$oid || appointment.doctor_id,
      patient_id: appointment.patient_id?.$oid || appointment.patient_id,
      date: appointment.date,
      time: appointment.time || '',
      status: appointment.status || 'scheduled'
    };
  }

  private transformConsultation(consultation: any): Consultation {
    return {
      ...consultation,
      _id: consultation._id?.$oid || consultation._id,
      patient_id: consultation.patient_id?.$oid || consultation.patient_id,
      doctor_id: consultation.doctor_id?.$oid || consultation.doctor_id
    };
  }

  updatePatientProfile(patientId: string, data: Partial<Patient>): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/patients/${patientId}`, data);
  }
}
