import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagerieService {

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getConversation(senderId: string, receiverId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/conversation/${senderId}/${receiverId}`);
  }

  sendMessage(senderId: string, receiverId: string, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send_message`, {
      sender_id: senderId,
      receiver_id: receiverId,
      content
    });
  }

  markAsRead(messageId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/mark_read/${messageId}`, {});
  }

  getUserMessages(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get_messages?user_id=${userId}`);
  }

  getUserNameById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_username/${userId}`);
  }
  getUnreadMessagesCount(userId: string): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/get_messages?user_id=${userId}`).pipe(
      map(messages => messages.filter(message => !message.read).length)
    );
  }


}
