import { Request, Response } from 'express';
import { ChatService } from './Chat.service';
import { CreateConversationRequest } from './Chat.types';

export class ChatController {
  private service = new ChatService();

  async createConversation(req: Request, res: Response) {
    try {
      const { peerId } = req.body as CreateConversationRequest;
      const userId = (req as any).user.id;
      const userRole = (req as any).user.role;

      if (!peerId) {
        return res.status(400).json({ message: 'peerId requis' });
      }

      const conversation = await this.service.createOrGetConversation(userId, peerId, userRole);
      
      res.status(200).json({
        success: true,
        data: conversation
      });
    } catch (error: any) {
      console.error('Erreur lors de la création de conversation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la création de conversation',
        error: error.message
      });
    }
  }

  async getConversations(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const conversations = await this.service.getUserConversations(userId);
      
      res.status(200).json({
        success: true,
        data: conversations
      });
    } catch (error: any) {
      console.error('Erreur lors de la récupération des conversations:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération des conversations',
        error: error.message
      });
    }
  }

  async getMessages(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const userId = (req as any).user.id;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      if (!conversationId) {
        return res.status(400).json({ message: 'conversationId requis' });
      }

      const messages = await this.service.getConversationMessages(conversationId, userId, limit, offset);
      
      res.status(200).json({
        success: true,
        data: messages
      });
    } catch (error: any) {
      console.error('Erreur lors de la récupération des messages:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération des messages',
        error: error.message
      });
    }
  }
  
  async sendMessage(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const { text } = req.body;
      const userId = (req as any).user.id;

      if (!conversationId) {
        return res.status(400).json({ message: 'conversationId requis' });
      }

      if (!text) {
        return res.status(400).json({ message: 'text requis' });
      }

      const message = await this.service.sendMessage(conversationId, userId, text);
      
      res.status(201).json({
        success: true,
        data: message
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du message:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de l\'envoi du message',
        error: error.message
      });
    }
  }


  async markAsRead(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const userId = (req as any).user.id;

      if (!conversationId) {
        return res.status(400).json({ message: 'conversationId requis' });
      }

      await this.service.markConversationAsRead(conversationId, userId);
      
      res.status(200).json({
        success: true,
        message: 'Conversation marquée comme lue'
      });
    } catch (error: any) {
      console.error('Erreur lors du marquage comme lu:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors du marquage comme lu',
        error: error.message
      });
    }
  }
}
