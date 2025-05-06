import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private readonly API_URL = 'http://localhost:5000/admin/stats';

  constructor(private http: HttpClient) {}
  toggleAdStatus(adId: string): Observable<any> {
    return this.http.put(`http://127.0.0.1:5000/advertisements/${adId}/toggle-status`, {})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('API Error:', error);
          return throwError(() => new Error(
            error.error?.message ||
            'Failed to toggle ad status. Please try again later.'
          ));
        })
      );
  }

  getStats(period: string): Observable<any> {
    return this.http.get(`${this.API_URL}?period=${period}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', error);
        return throwError(() => new Error(
          error.error?.message ||
          'Failed to load statistics. Please try again later.'
        ));
      })
    );

  }
}
