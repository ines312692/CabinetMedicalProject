// stats.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { StatsResponse } from '../models/stats.interface';

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
    
    // For testing without backend:
    /*
    const mockData: StatsResponse = {
      appointments: {
        total: 15,
        accepted: 10,
        pending: 3,
        rejected: 2
      },
      documents: {
        byType: [
          { type: 'pdf', count: 5 },
          { type: 'jpg', count: 3 }
        ],
        byStatus: []
      },
      responseTime: {
        average: 2.5,
        byDoctor: [
          { doctorId: '1', doctorName: 'Dr. Smith', averageTime: 2.0 },
          { doctorId: '2', doctorName: 'Dr. Johnson', averageTime: 3.0 }
        ]
      }
    };
    return of(mockData).pipe(delay(500));
    */
  }
}