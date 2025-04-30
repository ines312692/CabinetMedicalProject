import {Doctor} from "./Docter.interface";



export interface Patient {
  _id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  email: string;
  phone?: string;
  address?: string;
  image?: string;
  role: string;
}



export interface Consultation {
  _id: string;
  date: string;
  notes: string;
  patient_id: string;
  doctor_id?: string;
  doctor?: Doctor;
}




