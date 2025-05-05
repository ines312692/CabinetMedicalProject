import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import {IonicModule} from "@ionic/angular";
import {DatePipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    DatePipe,
    NgIf,
    NgForOf
  ]
})
export class NotificationsPage implements OnInit {
  notifications: any[] = [];
  userId: string | null = null;
  isLoading: boolean = false;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userId = user.id;
        this.fetchNotifications();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  fetchNotifications() {
    if (!this.userId) return;

    this.isLoading = true;
    this.http
      .get<{ notifications: any[]; page: number }>(
        `http://localhost:5000/notifications/${this.userId}`
      )
      .subscribe({
        next: (response) => {
          this.notifications = response.notifications.map((notif) => ({
            ...notif,
            timestamp: new Date(notif.timestamp),
          }));
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching notifications:', err);
          this.isLoading = false;
        },
      });
  }

  markAsRead(notificationId: string) {
    this.http
      .put(`http://localhost:5000/notifications/${notificationId}/read`, {})
      .subscribe({
        next: () => {
          const notification = this.notifications.find(
            (n) => n._id === notificationId
          );
          if (notification) {
            notification.is_read = true;
          }
          this.authService.getNotificationCount(this.userId!).subscribe();
        },
        error: (err) => {
          console.error('Error marking notification as read:', err);
        },
      });
  }

  goToNotificationDetails(notification: any) {
    if (notification.data.type === 'appointment') {
      this.router.navigate(['/appointment', notification.data.appointment_id]);
    }
    if (!notification.is_read) {
      this.markAsRead(notification._id);
    }
  }
}
