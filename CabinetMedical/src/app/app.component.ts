import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TabsPage } from "./pages/tabs/tabs.page";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule, TabsPage]
})
export class AppComponent {
  isLoggedIn = false;
  userRole: string | null = null;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.userRole = user?.role || null;
    });
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