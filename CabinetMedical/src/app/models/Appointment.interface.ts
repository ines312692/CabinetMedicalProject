export interface Appointment {
  _id: { $oid: string };
  date: string;
  reason: string;
  time: string;
  location: {
    latitude: number;
    longitude: number;
  };
  doctor_id: { $oid: string } | string;
  patient_id: { $oid: string } | string;
  status: string;
}
