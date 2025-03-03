import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  uploadDocument(formData: FormData): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getDocuments(): Observable<unknown> {
    return this.http.get(`${this.apiUrl}/documents`);
  }

  deleteDocument(documentId: string): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/documents/${documentId}`);
  }

  getDocumentById(documentId: string) {
    return this.http.get(`${this.apiUrl}/documents/${documentId}`);
  }
}
