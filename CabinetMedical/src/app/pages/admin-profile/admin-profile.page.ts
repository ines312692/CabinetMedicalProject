import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.page.html',
  styleUrls: ['./admin-profile.page.scss'],
  standalone: false
})
export class AdminProfilePage implements OnInit {

  constructor(private router: Router) {} // Injecter Router

  navigateToDashboard() {
    this.router.navigate(['/admin-profile/dashboard']);
  }

  ngOnInit() {
  }
 
 onButtonClick() {
  this.router.navigate(['/add-doctor']); 
}
onButtonClick2() {
  this.router.navigate(['/add-pub']); 
}
viewAllAdvertisements() {
  this.router.navigate(['/admin-profile/all-advertisements']);
}


}
