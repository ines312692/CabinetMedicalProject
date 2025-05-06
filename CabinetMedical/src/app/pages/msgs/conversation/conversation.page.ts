import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessagerieService } from 'src/app/services/messagerie.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
  standalone:false
})
export class ConversationPage implements OnInit {

  senderId!: string;
  receiverId!: string;
  messages: any[] = [];
  newMessage: string = '';
  receiverName: string = '';

  constructor(
    private route: ActivatedRoute,
    private messagerieService: MessagerieService
  ) {}

  ngOnInit() {
    this.senderId = this.route.snapshot.paramMap.get('senderId')!;
    this.receiverId = this.route.snapshot.paramMap.get('receiverId')!;

    this.loadMessages();
    this.loadReceiverName();
  }

  loadMessages() {
    this.messagerieService.getConversation(this.senderId, this.receiverId).subscribe(
      data => {
        this.messages = data.map(msg => ({
          ...msg,
          sender_id: typeof msg.sender_id === 'object' && msg.sender_id.$oid
            ? msg.sender_id.$oid
            : msg.sender_id
        }));
      },
      error => console.error('Erreur chargement conversation', error)
    );
  }
  

  loadReceiverName() {
    this.messagerieService.getUserNameById(this.receiverId).subscribe(
      res => this.receiverName = res.name,
      err => this.receiverName = 'Utilisateur'
    );
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.messagerieService.sendMessage(this.senderId, this.receiverId, this.newMessage).subscribe(
      () => {
        this.newMessage = '';
        this.loadMessages();
      },
      error => console.error('Erreur envoi', error)
    );
  }

}
