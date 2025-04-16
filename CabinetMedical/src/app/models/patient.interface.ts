import { Doctor } from "./Docter.interface";

export interface Patient {
  _id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  email: string;
  role: string;
  address?: string;
  phone?: string;
  image?: string;
  allergies?: string[];
}

export interface Appointment {
  _id: string;
  date: string;
  reason: string;
  time: string;
  status: string;
  doctor_id: string;
  patient_id: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  doctor?: Doctor;
}

export interface Consultation {
  _id: string;
  date: string;
  notes: string;
  patient_id: string;
  doctor_id?: string;
  doctor?: Doctor;
}

export interface Diagnostic {
  _id: string;
  date: string;
  result: string;
  patient_id: string;
}
export interface Prescription {
  _id: string;
  date: string;
  medication: string;
  patient_id?: string;
}

export interface History {
  appointments: Appointment[];
  consultations: Consultation[];
}

export interface DiagnosticsData {
  diagnostics: Diagnostic[];
  prescriptions: Prescription[];
}