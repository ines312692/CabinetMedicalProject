export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  description: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  password: string;
  email: string;
  image: string;
  availability: { day: string, hours: string[] }[];
}
