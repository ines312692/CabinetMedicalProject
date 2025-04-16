export interface Message {
    unique_id: string | number;
    sender_id: string;
    receiver_id: string;
    message: string;
    firstMessage?: boolean;
    timestamp?: Date;
  }