import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authMiddleware";
import { JournalController } from "./Journal.controller";

const router = Router();

// Toutes les routes journal sont protégées et basées sur l'utilisateur connecté
router.use(authenticate);

// 📖 Récupérer toutes les entrées du journal de l'utilisateur connecté
router.get("/", JournalController.list);

// ➕ Créer une nouvelle entrée
router.post("/", JournalController.create);

// ✏️ Modifier une entrée spécifique
router.put("/:id", JournalController.update);

// ❌ Supprimer une entrée spécifique
router.delete("/:id", JournalController.remove);

export default router;
