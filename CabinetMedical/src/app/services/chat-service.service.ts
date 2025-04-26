import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly baseUrl = 'http://localhost:5000/api';

  constructor(private readonly http: HttpClient) {}

  sendMessage(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/sendmessage`, data);
  }

  getMessages(data: any, page: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/getAllmessage?page=${page}`, data);
  }



}
