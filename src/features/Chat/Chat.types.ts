export interface Conversation {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface ConversationParticipant {
  conversation_id: string;
  user_id: string;
  role: 'patient' | 'psychologue';
  joined_at: Date;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  created_at: Date;
  read_at?: Date;
}

export interface CreateConversationRequest {
  peerId: string; // ID du psychologue ou patient
}

export interface SendMessageRequest {
  conversationId: string;
  text: string;
}

export interface JoinConversationRequest {
  conversationId: string;
}

export interface SocketAuth {
  userId: string;
  token: string;
}

// Événements Socket.IO
export interface ServerToClientEvents {
  messageNew: (data: { message: Message; conversationId: string }) => void;
  userTyping: (data: { userId: string; conversationId: string; isTyping: boolean }) => void;
  messageRead: (data: { messageId: string; conversationId: string; readBy: string }) => void;
  conversationJoined: (data: { conversationId: string; participants: string[] }) => void;
  error: (data: { message: string; code?: string }) => void;
  authenticated: (data: { success: boolean }) => void;
}

export interface ClientToServerEvents {
  authenticate: (data: SocketAuth) => void;
  joinConversation: (data: JoinConversationRequest) => void;
  leaveConversation: (data: { conversationId: string }) => void;
  sendMessage: (data: SendMessageRequest) => void;
  typing: (data: { conversationId: string; isTyping: boolean }) => void;
  markAsRead: (data: { messageId: string; conversationId: string }) => void;
}