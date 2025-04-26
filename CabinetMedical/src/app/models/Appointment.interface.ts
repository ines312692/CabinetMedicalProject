import { Doctor } from "./Doctor";

export interface Appointment {
  _id: { $oid: string } | string;
  date: string;
  reason: string;
  time: string;
  status: string;
  doctor_id: { $oid: string } | string;
  patient_id: { $oid: string } | string;
  location: {
    latitude: number;
    longitude: number;
  };
  // Optional fields for frontend
  doctor?: {
    _id: string;
    name: string;
    specialty: string;
    description: string;
    address: string;
    phone: string;
    latitude: number;
    longitude: number;
    image: string;
    email?: string;
    role?: string;
    availability?: { day: string, hours: string[] }[];
  };
}
