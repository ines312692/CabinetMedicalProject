import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {Appointment} from "../models/Appointment.interface";


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  getAppointmentById(id: string): Observable<Appointment> {
    const appointment: Appointment = {
      doctor: {
        name: 'Dr. John Doe',
        specialty: 'Cardiology',
        address: '123 Medical St, Health City',
        phone: '123-456-7890',
        image: 'doctor.jpg'
      },
      service: 'Cardiac Consultation',
      date: '2023-10-01',
      time: '10:00 AM',
      location: {
        latitude: 51.5074,
        longitude: -0.1276
      }
    };
    return of(appointment);
  }
}
