export interface Doctor {
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


}

