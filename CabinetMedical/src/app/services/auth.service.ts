import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

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

  private apiUrl = 'http://localhost:5000';
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable(); 

  constructor(private http: HttpClient) {
    // Check localStorage on initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  signup(userData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }
  login(loginData: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData).pipe(
      tap((response: any) => {
        // Store user data in localStorage and BehaviorSubject
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response);
      })
    );
  }
  logout() {
    // Clear authentication data
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  getCurrentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }
}
