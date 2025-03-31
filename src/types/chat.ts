export interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastSeen: Date;
}

export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  userId: string;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: {
    text: string;
    timestamp: Date;
    status?: 'sent' | 'delivered' | 'read';
  };
  unreadCount: number;
  online: boolean;
} 