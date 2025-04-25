export interface Doctor {
  _id: { $oid: string }; // Changed from id to _id to match MongoDB
  id?: string;
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
