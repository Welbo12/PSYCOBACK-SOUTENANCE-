// import { Server, Socket } from 'socket.io';
// import { ChatService } from './Chat.service';
// import { ServerToClientEvents, ClientToServerEvents, SocketAuth } from './Chat.types';
// import jwt from 'jsonwebtoken';

// export class ChatGateway {
//   private service = new ChatService();
//   private io: Server<ClientToServerEvents, ServerToClientEvents>;

//   constructor(io: Server<ClientToServerEvents, ServerToClientEvents>) {
//     this.io = io;
//     this.setupSocketHandlers();
//   }

//   private setupSocketHandlers() {
//     this.io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
//       console.log(`🔌 Nouvelle connexion Socket.IO: ${socket.id}`);

//       // Authentification au handshake
//       socket.on('authenticate', async (data: SocketAuth) => {
//         try {
//           const decoded = jwt.verify(data.token, process.env.JWT_SECRET!) as any;
//           (socket as any).userId = decoded.id;
//           (socket as any).userRole = decoded.role;
//           console.log(`✅ Socket authentifié: ${decoded.id} (${decoded.role})`);
          
//           socket.emit('authenticated', { success: true });
//         } catch (error) {
//           console.error('❌ Échec authentification socket:', error);
//           socket.emit('error', { message: 'Token invalide', code: 'AUTH_FAILED' });
//           socket.disconnect();
//         }
//       });

//       // Rejoindre une conversation
//       socket.on('joinConversation', async (data: JoinConversationRequest) => {
//         try {
//           const userId = (socket as any).userId;
//           if (!userId) {
//             socket.emit('error', { message: 'Non authentifié', code: 'NOT_AUTHENTICATED' });
//             return;
//           }

//           const { conversationId } = data;
//           const participants = await this.service.getConversationParticipants(conversationId);
          
//           // Vérifier que l'utilisateur fait partie de la conversation
//           if (!participants.includes(userId)) {
//             socket.emit('error', { message: 'Non autorisé', code: 'NOT_AUTHORIZED' });
//             return;
//           }

//           // Rejoindre la room
//           socket.join(conversationId);
//           console.log(`👥 ${userId} a rejoint la conversation ${conversationId}`);
          
//           socket.emit('conversationJoined', { conversationId, participants });
//         } catch (error: any) {
//           console.error('Erreur joinConversation:', error);
//           socket.emit('error', { message: error.message });
//         }
//       });

//       // Quitter une conversation
//       socket.on('leaveConversation', (data: { conversationId: string }) => {
//         const { conversationId } = data;
//         socket.leave(conversationId);
//         console.log(`👋 ${(socket as any).userId} a quitté la conversation ${conversationId}`);
//       });

//       // Envoyer un message
//       socket.on('sendMessage', async (data: SendMessageRequest) => {
//         try {
//           const userId = (socket as any).userId;
//           if (!userId) {
//             socket.emit('error', { message: 'Non authentifié', code: 'NOT_AUTHENTICATED' });
//             return;
//           }

//           const { conversationId, text } = data;
          
//           // Créer le message
//           const message = await this.service.sendMessage(conversationId, userId, text);
          
//           // Diffuser à tous les participants de la conversation
//           this.io.to(conversationId).emit('messageNew', { message, conversationId });
          
//           console.log(`💬 Message envoyé dans ${conversationId} par ${userId}`);
//         } catch (error: any) {
//           console.error('Erreur sendMessage:', error);
//           socket.emit('error', { message: error.message });
//         }
//       });

//       // Indicateur de frappe
//       socket.on('typing', (data: { conversationId: string; isTyping: boolean }) => {
//         const userId = (socket as any).userId;
//         if (!userId) return;

//         const { conversationId, isTyping } = data;
//         socket.to(conversationId).emit('userTyping', { userId, conversationId, isTyping });
//       });

//       // Marquer comme lu
//       socket.on('markAsRead', async (data: { messageId: string; conversationId: string }) => {
//         try {
//           const userId = (socket as any).userId;
//           if (!userId) return;

//           const { messageId, conversationId } = data;
//           await this.service.markConversationAsRead(conversationId, userId);
          
//           // Notifier les autres participants
//           socket.to(conversationId).emit('messageRead', { messageId, conversationId, readBy: userId });
//         } catch (error: any) {
//           console.error('Erreur markAsRead:', error);
//         }
//       });

//       // Déconnexion
//       socket.on('disconnect', () => {
//         console.log(`🔌 Déconnexion Socket.IO: ${socket.id}`);
//       });
//     });
//   }

//   // Méthode pour diffuser un message depuis l'extérieur (ex: API REST)
//   async broadcastMessage(conversationId: string, message: any) {
//     this.io.to(conversationId).emit('messageNew', { message, conversationId });
//   }
// }
import { Server, Socket } from 'socket.io';
import { ChatService } from './Chat.service';
import { ServerToClientEvents, ClientToServerEvents, SocketAuth, JoinConversationRequest, SendMessageRequest } from './Chat.types';
import jwt from 'jsonwebtoken';

export class ChatGateway {
  private service = new ChatService();
  private io: Server<ClientToServerEvents, ServerToClientEvents>;

  constructor(io: Server<ClientToServerEvents, ServerToClientEvents>) {
    this.io = io;
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
      console.log(`🔌 Nouvelle connexion Socket.IO: ${socket.id}`);

      // Authentification au handshake
      socket.on('authenticate', async (data: SocketAuth) => {
        try {
          const decoded = jwt.verify(data.token, process.env.JWT_SECRET!) as any;
          (socket as any).userId = decoded.id;
          (socket as any).userRole = decoded.role;
          console.log(`✅ Socket authentifié: ${decoded.id} (${decoded.role})`);
          
          socket.emit('authenticated', { success: true });
        } catch (error) {
          console.error('❌ Échec authentification socket:', error);
          socket.emit('error', { message: 'Token invalide', code: 'AUTH_FAILED' });
          socket.disconnect();
        }
      });

      // Rejoindre une conversation
      socket.on('joinConversation', async (data: JoinConversationRequest) => {
        try {
          const userId = (socket as any).userId;
          if (!userId) {
            socket.emit('error', { message: 'Non authentifié', code: 'NOT_AUTHENTICATED' });
            return;
          }

          const { conversationId } = data;
          const participants = await this.service.getConversationParticipants(conversationId);
          
          // Vérifier que l'utilisateur fait partie de la conversation
          if (!participants.includes(userId)) {
            socket.emit('error', { message: 'Non autorisé', code: 'NOT_AUTHORIZED' });
            return;
          }

          // Rejoindre la room
          socket.join(conversationId);
          console.log(`👥 ${userId} a rejoint la conversation ${conversationId}`);
          
          socket.emit('conversationJoined', { conversationId, participants });
        } catch (error: any) {
          console.error('Erreur joinConversation:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Quitter une conversation
      socket.on('leaveConversation', (data: { conversationId: string }) => {
        const { conversationId } = data;
        socket.leave(conversationId);
        console.log(`👋 ${(socket as any).userId} a quitté la conversation ${conversationId}`);
      });

      // Envoyer un message
      socket.on('sendMessage', async (data: SendMessageRequest) => {
        try {
          const userId = (socket as any).userId;
          if (!userId) {
            socket.emit('error', { message: 'Non authentifié', code: 'NOT_AUTHENTICATED' });
            return;
          }

          const { conversationId, text } = data;
          
          // Créer le message
          const message = await this.service.sendMessage(conversationId, userId, text);
          
          // Diffuser à tous les participants de la conversation
          this.io.to(conversationId).emit('messageNew', { message, conversationId });
          
          console.log(`💬 Message envoyé dans ${conversationId} par ${userId}`);
        } catch (error: any) {
          console.error('Erreur sendMessage:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Indicateur de frappe
      socket.on('typing', (data: { conversationId: string; isTyping: boolean }) => {
        const userId = (socket as any).userId;
        if (!userId) return;

        const { conversationId, isTyping } = data;
        socket.to(conversationId).emit('userTyping', { userId, conversationId, isTyping });
      });

      // Marquer comme lu
      socket.on('markAsRead', async (data: { messageId: string; conversationId: string }) => {
        try {
          const userId = (socket as any).userId;
          if (!userId) return;

          const { messageId, conversationId } = data;
          await this.service.markConversationAsRead(conversationId, userId);
          
          // Notifier les autres participants
          socket.to(conversationId).emit('messageRead', { messageId, conversationId, readBy: userId });
        } catch (error: any) {
          console.error('Erreur markAsRead:', error);
        }
      });

      // Déconnexion
      socket.on('disconnect', () => {
        console.log(`🔌 Déconnexion Socket.IO: ${socket.id}`);
      });
    });
  }

  // Méthode pour diffuser un message depuis l'extérieur (ex: API REST)
  async broadcastMessage(conversationId: string, message: any) {
    this.io.to(conversationId).emit('messageNew', { message, conversationId });
  }
}
