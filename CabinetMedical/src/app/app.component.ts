import { Component, OnInit } from '@angular/core';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken } from 'firebase/messaging';
import { Capacitor } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

const firebaseConfig = {
  apiKey: "AIzaSyB44xvEJeZM-z12PJlCO8RRCPWjnO8hfvI",
  authDomain: "appmedical-936e4.firebaseapp.com",
  projectId: "appmedical-936e4",
  storageBucket: "appmedical-936e4.appspot.com",
  messagingSenderId: "911828432393",
  appId: "1:911828432393:web:a2e854d2e008aeba496ad8",
  measurementId: "G-N242QXWRME"
};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private app: any;
  isLoggedIn = false;
  userRole: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(this.app);
    console.log('Firebase initialized with analytics:', analytics);

    // Subscribe to auth changes
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.userRole = user?.role || null;
      if (user && user.id) {
        // Initialize FCM when user logs in
        this.initializeFCM(user.id, user.role || 'patient');
      }
    });
  }

  ngOnInit() {
    // Check for existing user on app load
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role') || 'patient';
    if (userId) {
      this.initializeFCM(userId, role);
    } else {
      console.warn('No user_id found in localStorage, skipping FCM initialization');
    }
  }

  async initializeFCM(userId: string, role: string = 'patient') {
    try {
      console.log('Checking FCM permissions...');
      const permission = await FirebaseMessaging.checkPermissions();
      console.log('Permission status:', permission);

      if (permission.receive !== 'granted') {
        console.log('Requesting FCM permissions...');
        const result = await FirebaseMessaging.requestPermissions();
        if (result.receive !== 'granted') {
          console.warn('Notification permissions not granted:', result);
          return null;
        }
      }

      console.log('Getting FCM token...');
      const isWeb = Capacitor.getPlatform() === 'web';
      let fcmToken: string;

      if (isWeb) {
        const messaging = getMessaging(this.app);
        fcmToken = await getToken(messaging, {
          vapidKey: 'BJITeZfngmfvH4sPl__lvkLIhjOoq7sl_jHiDuNTVwY6wGRc4Xxb0UJwaCvEgMLbfYxg9bOZmhJSGO5rEs0fvSU',
          serviceWorkerRegistration: await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        });
      } else {
        const result = await FirebaseMessaging.getToken();
        fcmToken = result.token;
      }

      console.log('FCM Token:', fcmToken);

      const payload = { userId, fcmToken, role };
      console.log('Sending payload to backend:', payload);

      const response = await fetch('http://localhost:5000/register-fcm-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Backend request failed: ${response.status} ${response.statusText}`);
        console.error('Backend response:', errorText);
        throw new Error(`Backend request failed: ${response.status} ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Backend response:', responseData);
      return fcmToken;
    } catch (error) {
      console.error('FCM initialization failed:', error);
      return null;
    }
  }

  handleAuthAction() {
    if (this.isLoggedIn) {
      this.authService.logout();
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
