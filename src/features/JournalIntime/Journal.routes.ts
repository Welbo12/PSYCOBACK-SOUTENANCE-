import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authMiddleware";
import { JournalController } from "./Journal.controller";

const router = Router();

// Toutes les routes journal sont protégées et basées sur l'utilisateur connecté
router.use(authenticate);

// 📖 Récupérer le journal de l'utilisateur connecté
router.get("/me", JournalController.me);

// ➕ Créer/MàJ le journal de l'utilisateur connecté
router.post("/", JournalController.upsert);

// ✏️ Modifier le journal
router.put("/", JournalController.update);

// ❌ Supprimer le journal
router.delete("/", JournalController.remove);

export default router;
