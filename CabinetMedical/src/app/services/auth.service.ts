import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface SignupData {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
}
export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  role: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5000'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  signup(userData: SignupData): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }
  login(loginData: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData);
  }
}
