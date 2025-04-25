import {Component, OnDestroy, OnInit} from '@angular/core';
import {DoctorService} from "../services/doctor.service";
import { PubserviceService } from '../services/pubservice.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  doctors: any[] = [];
  pubs: any[] = [];
  filteredDoctors: any[] = [];
  currentDoctorIndex: number = 0;
  intervalId: any;
  selectedSpecialty: string | null = null;
  allSpecialties: string[] = ['Médecine Générale', 'Cardiologie', 'Dermatologie', 'Pédiatrie','Orthopédie','Gynécologie-Obstétrique','Ophtalmologie','Psychiatrie','ORL','Dentisterie'];
  selectedGovernorat: string | null = null;
  allGovernorats: string[] = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
    'Bizerte', 'Béja', 'Jendouba', 'Kef', 'Siliana', 'Sousse',
    'Monastir', 'Mahdia', 'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid',
    'Gabès', 'Medenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kebili'
  ];
  filteredPubs: any[] = []; 
  constructor(private doctorService: DoctorService, private pubService:PubserviceService) {}

  ngOnInit() {
    this.loadDoctors();
    this.loadPubs();
    this.startImageRotation();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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
  swiperSlideChanged(e:any) {
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
    

    searchDoctors(event: any) {
      const query = event.target.value.toLowerCase();
      this.filteredDoctors = this.doctors.filter(doctor => {
        // Filtre par recherche
        const matchesSearch = !query || 
                           doctor.name.toLowerCase().includes(query) || 
                           doctor.specialty.toLowerCase().includes(query);
        
        // Filtre par spécialité
        const matchesSpecialty = !this.selectedSpecialty || 
                              doctor.specialty.toLowerCase().includes(this.selectedSpecialty.toLowerCase());
        
        // Filtre par gouvernorat (nouveau)
        const matchesGovernorat = !this.selectedGovernorat || 
                               doctor.address.toLowerCase().includes(this.selectedGovernorat.toLowerCase());
        
        return matchesSearch && matchesSpecialty && matchesGovernorat;
      });
    }
 

    filterPubsByDate() {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Pour ignorer l'heure dans la comparaison
      
      this.filteredPubs = this.pubs.filter(pub => {
        if (!pub.dateFin) return true; // Si pas de date de fin, on affiche
        
        const dateFin = new Date(pub.dateFin);
        dateFin.setHours(0, 0, 0, 0);
        
        return dateFin >= today;
      });
    }

}


 

