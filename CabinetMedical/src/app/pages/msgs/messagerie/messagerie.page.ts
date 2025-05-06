import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessagerieService } from 'src/app/services/messagerie.service';

@Component({
  selector: 'app-messagerie',
  templateUrl: './messagerie.page.html',
  styleUrls: ['./messagerie.page.scss'],
  standalone:false
})
export class MessageriePage implements OnInit {
  currentUserId: string = '';
  conversations: any[] = [];

  constructor(
    private messagerieService: MessagerieService,
    private router: Router
  ) {}

  ngOnInit() {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.currentUserId = storedUserId;
      this.loadUserMessages();
    } else {
      console.warn('Utilisateur non connecté.');
    }
  }

  loadUserMessages() {
    this.messagerieService.getUserMessages(this.currentUserId).subscribe(
      messages => {
        const conversationMap: { [key: string]: any } = {};

        messages.forEach(message => {
          const otherUserId = message.sender_id === this.currentUserId ? message.receiver_id : message.sender_id;

          if (!conversationMap[otherUserId]) {
            conversationMap[otherUserId] = {
              otherUserId,
              lastMessage: message,
              otherUserName: 'Chargement...'
            };

            // Récupérer le nom via Flask
            this.messagerieService.getUserNameById(otherUserId).subscribe(
              response => {
                conversationMap[otherUserId].otherUserName = response.name;
              },
              error => {
                console.error(`Erreur pour l'utilisateur ${otherUserId}`, error);
                conversationMap[otherUserId].otherUserName = 'Inconnu';
              }
            );
          }
        });

        this.conversations = Object.values(conversationMap);
      },
      error => {
        console.error('Erreur lors du chargement des messages', error);
      }
    );
  }

  openConversation(otherUserId: string) {
    this.router.navigate(['/conversation', this.currentUserId, otherUserId]);
  }



}
