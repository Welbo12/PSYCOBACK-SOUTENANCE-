import { Router } from 'express';
import { ChatController } from './Chat.controller';
import { authenticate } from '../../shared/middlewares/authMiddleware';

const router = Router();
const chatController = new ChatController();

// Routes protégées - nécessitent une authentification
router.use(authenticate);

// Créer ou récupérer une conversation
router.post('/conversations', chatController.createConversation);

// Récupérer les conversations de l'utilisateur
router.get('/conversations', chatController.getConversations);

// Récupérer les messages d'une conversation
router.get('/conversations/:conversationId/messages', chatController.getMessages);

// Marquer une conversation comme lue
router.post('/conversations/:conversationId/read', chatController.markAsRead);

export default router;
