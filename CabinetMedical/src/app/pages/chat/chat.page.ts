import { Component, Inject, OnInit } from "@angular/core";
import { ChatService } from "../../services/chat-service.service";
import { Message } from "../../models/Message.interface";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { NgClass, NgForOf } from "@angular/common";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    NgClass,
    NgForOf
  ]
})
export class ChatPage implements OnInit {
  textMessage: string = '';
  unique_id: string | number = '';
  receiver_id: string = '';
  sender_id: string = '';
  firstMessage: boolean = false;
  allMessages: Message[] = [];
  page: number = 1;
  last_page: number = 0;

  constructor(
    private readonly chatService: ChatService,
    @Inject('Storage') private readonly storage: Storage // Injection avec un token
  ) {}

  async sendMessage(): Promise<void> {
    const login = this.storage.getItem("login");
    if (login) {
      const { user_id } = JSON.parse(login);
      this.sender_id = user_id;
      const data: Message = {
        message: this.textMessage,
        unique_id: this.unique_id ? this.unique_id : new Date().getTime(),
        sender_id: this.sender_id,
        receiver_id: this.receiver_id,
        firstMessage: this.firstMessage,
      };

      this.chatService.sendMessage(data).subscribe((res: any) => {
        this.unique_id = res.unique_id;
        this.textMessage = "";
        this.allMessages.push(data);
      });
    }
  }

  async getUserMessages(receiver_id: string): Promise<void> {
    if (this.page > 2 && this.last_page < this.page) return;

    const login = this.storage.getItem("login");
    if (login) {
      const { user_id } = JSON.parse(login);
      this.sender_id = user_id;
      const data = { sender_id: this.sender_id, receiver_id };

      this.chatService.getMessages(data, this.page).subscribe((res: any) => {
        this.last_page = res.data.last_page;
        if (this.page === 1) {
          this.allMessages = res.data.new;
        } else {
          this.allMessages.unshift(...res.data.new);
        }
      });
    }
  }

  ngOnInit(): void {
    const login = this.storage.getItem("login");
    if (login) {
      const { user_id } = JSON.parse(login);
      this.sender_id = user_id;
      this.getUserMessages(this.receiver_id);
    }
  }
}
