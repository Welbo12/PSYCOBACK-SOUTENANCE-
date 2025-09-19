"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../shared/middlewares/authMiddleware");
const Journal_controller_1 = require("./Journal.controller");
const router = (0, express_1.Router)();
// Toutes les routes journal sont protégées et basées sur l'utilisateur connecté
router.use(authMiddleware_1.authenticate);
//  Récupérer le journal de l'utilisateur connecté
router.get("/me", Journal_controller_1.JournalController.me);
// Créer/MàJ le journal de l'utilisateur connecté
router.post("/", Journal_controller_1.JournalController.upsert);
//  Modifier le journal
router.put("/", Journal_controller_1.JournalController.update);
//  Supprimer le journal
router.delete("/", Journal_controller_1.JournalController.remove);
exports.default = router;
