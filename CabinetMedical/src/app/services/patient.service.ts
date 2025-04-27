import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

import {  map } from 'rxjs/operators';
import {  Patient} from "../models/Patient.interface";


@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly apiUrl = 'http://localhost:5000';

  constructor(private readonly http: HttpClient) { }

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
        image: patient.image || 'default-avatar.png',
        allergies: patient.allergies || []
      }))
    );
  }

}
