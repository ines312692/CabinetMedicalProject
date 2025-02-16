import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {}

  uploadDocument(formData: FormData): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getDocuments(): Observable<unknown> {
    return this.http.get(`${this.apiUrl}`);
  }
}
