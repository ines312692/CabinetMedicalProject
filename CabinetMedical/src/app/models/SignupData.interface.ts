export interface SignupData {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
  phone?: string;
  allergies?: string;
  image?: File;
}
