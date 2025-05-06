import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginResponse } from '../models/LoginResponse.interface';
import { LoginData } from '../models/LoginData.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5000';
  private readonly currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient) {
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
        localStorage.setItem('currentUser', JSON.stringify(response));
        localStorage.setItem('userId', response.id); // Ensure userId is stored
        this.currentUserSubject.next(response);
      })
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userId');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  getUser(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }

  getNotificationCount(userId: string): Observable<number> {
    return this.http
      .get<{ count: number }>(`${this.apiUrl}/notifications/count/${userId}`)
      .pipe(map((response) => response.count));
  }

  getUserRole(): string | null {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser.role : null;
  }

  updateUser(userId: string, formData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}`, formData);
  }
}
