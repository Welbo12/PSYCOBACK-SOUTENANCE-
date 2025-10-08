import { ChatRepository } from './Chat.repository';
import { CreateConversationRequest, SendMessageRequest, Message, Conversation } from './Chat.types';

export class ChatService {
  private repository = new ChatRepository();

  async createOrGetConversation(userId: string, peerId: string, userRole: 'patient' | 'psychologue'): Promise<Conversation> {
    // Vérifier si une conversation existe déjà
    let conversation = await this.repository.getConversationByParticipants(userId, peerId);
    
    if (!conversation) {
      // Créer une nouvelle conversation
      conversation = await this.repository.createConversation();
      
      // Ajouter les participants
      await this.repository.addParticipant(conversation.id, userId, userRole);
      await this.repository.addParticipant(conversation.id, peerId, userRole === 'patient' ? 'psychologue' : 'patient');
    }
    
    return conversation;
  }

  async sendMessage(conversationId: string, senderId: string, text: string): Promise<Message> {
    // Vérifier que l'utilisateur fait partie de la conversation
    const isParticipant = await this.repository.isUserInConversation(senderId, conversationId);
    if (!isParticipant) {
      throw new Error('Utilisateur non autorisé à envoyer des messages dans cette conversation');
    }

    // Créer le message
    const message = await this.repository.createMessage(conversationId, senderId, text);
    
    // Mettre à jour la date de modification de la conversation
    await this.repository.updateConversationTimestamp(conversationId);
    
    return message;
  }

  async getConversationMessages(conversationId: string, userId: string, limit: number = 50, offset: number = 0): Promise<Message[]> {
    // Vérifier que l'utilisateur fait partie de la conversation
    const isParticipant = await this.repository.isUserInConversation(userId, conversationId);
    if (!isParticipant) {
      throw new Error('Utilisateur non autorisé à voir cette conversation');
    }

    return await this.repository.getMessages(conversationId, limit, offset);
  }

  async getUserConversations(userId: string): Promise<Array<Conversation & { last_message?: Message; unread_count: number }>> {
    return await this.repository.getUserConversations(userId);
  }

  async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    const isParticipant = await this.repository.isUserInConversation(userId, conversationId);
    if (!isParticipant) {
      throw new Error('Utilisateur non autorisé à marquer cette conversation comme lue');
    }

    await this.repository.markConversationAsRead(conversationId, userId);
  }

  async getConversationParticipants(conversationId: string): Promise<string[]> {
    const participants = await this.repository.getConversationParticipants(conversationId);
    return participants.map(p => p.user_id);
  }
}
