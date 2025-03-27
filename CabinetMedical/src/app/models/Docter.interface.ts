export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  description: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  image: string;
  availability: { day: string, hours: string[] }[];
}
