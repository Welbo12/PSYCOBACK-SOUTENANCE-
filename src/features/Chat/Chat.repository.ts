import pool from '../../shared/database/client';
import { Conversation, ConversationParticipant, Message } from './Chat.types';

export class ChatRepository {
  // Conversations
  async createConversation(): Promise<Conversation> {
    const { rows } = await pool.query(
      'INSERT INTO conversations (id, created_at, updated_at) VALUES (gen_random_uuid(), NOW(), NOW()) RETURNING *'
    );
    return rows[0];
  }

  async getConversationById(id: string): Promise<Conversation | null> {
    const { rows } = await pool.query(
      'SELECT * FROM conversations WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  }

  async getConversationByParticipants(userId1: string, userId2: string): Promise<Conversation | null> {
    const { rows } = await pool.query(`
      SELECT c.* FROM conversations c
      INNER JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
      INNER JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
      WHERE cp1.user_id = $1 AND cp2.user_id = $2
      AND c.id IN (
        SELECT conversation_id FROM conversation_participants 
        GROUP BY conversation_id 
        HAVING COUNT(*) = 2
      )
    `, [userId1, userId2]);
    return rows[0] || null;
  }

  async getUserConversations(userId: string): Promise<Array<Conversation & { last_message?: Message; unread_count: number }>> {
    const { rows } = await pool.query(`
      SELECT DISTINCT c.*, 
             m.text as last_message_text,
             m.created_at as last_message_created_at,
             m.sender_id as last_message_sender_id,
             COALESCE(unread.count, 0) as unread_count
      FROM conversations c
      INNER JOIN conversation_participants cp ON c.id = cp.conversation_id
      LEFT JOIN LATERAL (
        SELECT text, created_at, sender_id
        FROM messages 
        WHERE conversation_id = c.id 
        ORDER BY created_at DESC 
        LIMIT 1
      ) m ON true
      LEFT JOIN (
        SELECT conversation_id, COUNT(*) as count
        FROM messages 
        WHERE conversation_id IN (
          SELECT conversation_id FROM conversation_participants WHERE user_id = $1
        ) AND sender_id != $1 AND read_at IS NULL
        GROUP BY conversation_id
      ) unread ON c.id = unread.conversation_id
      WHERE cp.user_id = $1
      ORDER BY COALESCE(m.created_at, c.created_at) DESC
    `, [userId]);
    return rows;
  }

  // Participants
  async addParticipant(conversationId: string, userId: string, role: 'patient' | 'psychologue'): Promise<void> {
    await pool.query(
      'INSERT INTO conversation_participants (conversation_id, user_id, role, joined_at) VALUES ($1, $2, $3, NOW())',
      [conversationId, userId, role]
    );
  }

  async getConversationParticipants(conversationId: string): Promise<ConversationParticipant[]> {
    const { rows } = await pool.query(
      'SELECT * FROM conversation_participants WHERE conversation_id = $1',
      [conversationId]
    );
    return rows;
  }

  async isUserInConversation(userId: string, conversationId: string): Promise<boolean> {
    const { rows } = await pool.query(
      'SELECT 1 FROM conversation_participants WHERE user_id = $1 AND conversation_id = $2',
      [userId, conversationId]
    );
    return rows.length > 0;
  }

  // Messages
  async createMessage(conversationId: string, senderId: string, text: string): Promise<Message> {
    const { rows } = await pool.query(
      'INSERT INTO messages (id, conversation_id, sender_id, text, created_at) VALUES (gen_random_uuid(), $1, $2, $3, NOW()) RETURNING *',
      [conversationId, senderId, text]
    );
    return rows[0];
  }

  async getMessages(conversationId: string, limit: number = 50, offset: number = 0): Promise<Message[]> {
    const { rows } = await pool.query(
      'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [conversationId, limit, offset]
    );
    return rows.reverse(); // Retourner dans l'ordre chronologique
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    await pool.query(
      'UPDATE messages SET read_at = NOW() WHERE id = $1 AND sender_id != $2',
      [messageId, userId]
    );
  }

  async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    await pool.query(
      'UPDATE messages SET read_at = NOW() WHERE conversation_id = $1 AND sender_id != $2 AND read_at IS NULL',
      [conversationId, userId]
    );
  }

  async updateConversationTimestamp(conversationId: string): Promise<void> {
    await pool.query(
      'UPDATE conversations SET updated_at = NOW() WHERE id = $1',
      [conversationId]
    );
  }
}
