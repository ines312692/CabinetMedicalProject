import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  imports: [
    IonicModule
  ],
  standalone: true
})
export class TabsPage implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() { /* TODO document why this method 'ngOnInit' is empty */  }

  navigateToProfile() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const route = currentUser.role === 'patient'
        ? `/profile-patient/${currentUser.id}`
        : `/doctor-profile/${currentUser.id}`;
      this.router.navigate([route]);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
