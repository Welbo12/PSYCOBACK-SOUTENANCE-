"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../shared/middlewares/authMiddleware");
const Journal_controller_1 = require("./Journal.controller");
const router = (0, express_1.Router)();
// Toutes les routes journal sont protégées et basées sur l'utilisateur connecté
router.use(authMiddleware_1.authenticate);
// 📖 Récupérer toutes les entrées du journal de l'utilisateur connecté
router.get("/", Journal_controller_1.JournalController.list);
// ➕ Créer une nouvelle entrée
router.post("/", Journal_controller_1.JournalController.create);
// ✏️ Modifier une entrée spécifique
router.put("/:id", Journal_controller_1.JournalController.update);
// ❌ Supprimer une entrée spécifique
router.delete("/:id", Journal_controller_1.JournalController.remove);
exports.default = router;
