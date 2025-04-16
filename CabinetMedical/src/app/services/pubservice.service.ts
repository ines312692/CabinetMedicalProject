import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Publicite {
  id?: string;  // Ajout de l'ID pour gestion facile
  titre: string;
  description: string;
  dateFin: string;
  image?: string; // Correspond à ce que renvoie le backend
}

@Injectable({
  providedIn: 'root'
})
export class PubserviceService {
  private apiUrl = 'http://127.0.0.1:5000/advertisements';

  constructor(private http: HttpClient) {}

  /**
   * Ajoute une publicité
   */
  addPub(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  /**
   * Récupère toutes les publicités
   */
  getPubs(): Observable<Publicite[]> {
    return this.http.get<Publicite[]>(this.apiUrl);
  }

  /**
   * Supprime une publicité
   */
  deletePub(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
