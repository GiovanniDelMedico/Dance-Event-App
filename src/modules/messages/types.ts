
import type { User } from "../users/types";
export interface Message {
  id: number;
  content: string;
  createdAt: string;
  readAt: string | null;
  sender: {
    id: number;
    nickname: string;
    avatarUrl?: string | null; 
  };
}

export interface Conversation {
  id: number;
  creator: User;
  participant: User;
  messages: {
    id: number;
    content: string;
    createdAt: string;
    readAt: string| null;
    sender: { id: number; nickname: string };
  }[];
   hasUnread: boolean;
}


export interface ConversationCreated {
  id: number;
  creatorId: number;
  participantId: number;
  eventId?: number;
}
