// models/appointment.interface.ts
export interface Appointment {
  doctor: {
    image: string;
    name: string, specialty: string, address: string, phone: string },
  service: string,
  date: string,
  time: string,
  location: { latitude: number, longitude: number }
}
