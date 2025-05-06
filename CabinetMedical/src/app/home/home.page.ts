import { Component, OnDestroy, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { PubserviceService } from '../services/pubservice.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MessagerieService } from '../services/messagerie.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  unreadMessagesCount: number = 0;
  doctors: any[] = [];
  pubs: any[] = [];
  filteredDoctors: any[] = [];
  filteredPubs: any[] = [];
  currentDoctorIndex: number = 0;
  intervalId: any;
  selectedSpecialty: string | null = null;
  allSpecialties: string[] = [
    'Médecine Générale',
    'Cardiologie',
    'Dermatologie',
    'Pédiatrie',
    'Orthopédie',
    'Gynécologie-Obstétrique',
    'Ophtalmologie',
    'Psychiatrie',
    'ORL',
    'Dentisterie',
  ];
  selectedGovernorat: string | null = null;
  allGovernorats: string[] = [
    'Tunis',
    'Ariana',
    'Ben Arous',
    'Manouba',
    'Nabeul',
    'Zaghouan',
    'Bizerte',
    'Béja',
    'Jendouba',
    'Kef',
    'Siliana',
    'Sousse',
    'Monastir',
    'Mahdia',
    'Sfax',
    'Kairouan',
    'Kasserine',
    'Sidi Bouzid',
    'Gabès',
    'Medenine',
    'Tataouine',
    'Gafsa',
    'Tozeur',
    'Kebili',
  ];
  isLoggedIn: boolean = false;
  currentUserId: string  = '';
  notificationCount: number = 0; // New property for notification count

  constructor(
    private doctorService: DoctorService,
    private pubService: PubserviceService,
    private router: Router,
    private authService: AuthService,
    private messagerieService: MessagerieService,
  ) {}

  ngOnInit() {

    // Subscribe to authentication state changes
    this.authService.currentUser$.subscribe((user) => {
      console.log('User:', user);
      this.isLoggedIn = !!user;
      if (user) {
        this.currentUserId = user.id;
        this.fetchNotificationCount();
        // Poll for notification updates every 30 seconds
        this.startNotificationPolling();
      } else {
        this.currentUserId = '';
        this.notificationCount = 0;
      }
    });
    this.messagerieService.getUnreadMessagesCount(this.currentUserId).subscribe(
      count => {
        this.unreadMessagesCount = count;
      },
      error => {
        console.error('Erreur lors de la récupération des messages non lus', error);
      }
    );

    // Load doctors and pubs
    this.loadDoctors();
    this.loadPubs();
    this.startImageRotation();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Fetch notification count
  fetchNotificationCount() {
    if (this.currentUserId) {
      this.authService.getNotificationCount(this.currentUserId).subscribe({
        next: (count) => {
          this.notificationCount = count;
        },
        error: (err) => {
          console.error('Error fetching notification count:', err);
        },
      });
    }
  }

  // Start polling for notification updates
  startNotificationPolling() {
    interval(30000) // Every 30 seconds
      .pipe(switchMap(() => this.authService.getNotificationCount(this.currentUserId!)))
      .subscribe({
        next: (count) => {
          this.notificationCount = count;
        },
        error: (err) => {
          console.error('Error polling notification count:', err);
        },
      });
  }

  loadDoctors() {
    this.doctorService.getDoctors().subscribe(
      (data) => {
        this.doctors = data;
        this.filteredDoctors = data;
        console.log('Médecins récupérés :', this.doctors);
      },
      (error) => {
        console.error('Erreur lors de la récupération des médecins', error);
      }
    );
  }

  loadPubs() {
    this.pubService.getPubs().subscribe(
      (data2) => {
        this.pubs = data2;
        this.filterPubsByDate();
        console.log('Pubs récupérées :', this.pubs);
      },
      (error) => {
        console.error('Erreur lors de la récupération des pubs', error);
      }
    );
  }

  startImageRotation() {
    this.intervalId = setInterval(() => {
      this.currentDoctorIndex = (this.currentDoctorIndex + 1) % this.filteredDoctors.length;
    }, 3000); // Change image every 3 seconds
  }

  swiperSlideChanged(e: any) {
    console.log('slide changed', e);
  }

  toggleSpecialtyFilter(specialty: string) {
    this.selectedSpecialty = this.selectedSpecialty === specialty ? null : specialty;
    this.searchDoctors({ target: { value: '' } });
  }

  clearSpecialtyFilter() {
    this.selectedSpecialty = null;
    this.searchDoctors({ target: { value: '' } });
  }

  toggleGovernoratFilter(governorat: string) {
    this.selectedGovernorat = this.selectedGovernorat === governorat ? null : governorat;
    this.searchDoctors({ target: { value: '' } });
  }

  clearGovernoratFilter() {
    this.selectedGovernorat = null;
    this.searchDoctors({ target: { value: '' } });
  }

  goToProfile() {
    if (this.isLoggedIn && this.currentUserId) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser?.role === 'patient') {
        this.router.navigate(['/profile-patient', this.currentUserId]);
      } else {
        this.router.navigate(['/doctor-profile', this.currentUserId]);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToNotifications() {
    if (this.isLoggedIn && this.currentUserId) {
      this.router.navigate(['/notifications']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  searchDoctors(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredDoctors = this.doctors.filter((doctor) => {
      // Filter by search query
      const matchesSearch =
        !query ||
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query);

      // Filter by specialty
      const matchesSpecialty =
        !this.selectedSpecialty ||
        doctor.specialty.toLowerCase().includes(this.selectedSpecialty.toLowerCase());

      // Filter by governorate
      const matchesGovernorat =
        !this.selectedGovernorat ||
        doctor.address.toLowerCase().includes(this.selectedGovernorat.toLowerCase());

      return matchesSearch && matchesSpecialty && matchesGovernorat;
    });
  }

  filterPubsByDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignore time for comparison

    this.filteredPubs = this.pubs.filter((pub) => {
      if (!pub.dateFin) return true; // Show if no end date

      const dateFin = new Date(pub.dateFin);
      dateFin.setHours(0, 0, 0, 0);

      return dateFin >= today;
    });
  }
  openMessages(): void {
    this.router.navigate(['/messagerie']);
  }
}
