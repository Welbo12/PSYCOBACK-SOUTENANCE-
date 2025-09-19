"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalController = void 0;
const Journal_service_1 = require("./Journal.service");
class JournalController {
    // ➕ Créer/MàJ le journal de l'utilisateur connecté
    static upsert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { contenu } = req.body;
                if (!(user === null || user === void 0 ? void 0 : user.id) || typeof contenu !== "string") {
                    return res.status(400).json({ error: "Contenu requis" });
                }
                const journal = yield Journal_service_1.JournalService.upsertUserJournal(user.id, contenu);
                res.status(201).json(journal);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    // 📖 Récupérer le journal de l'utilisateur connecté
    static me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const entry = yield Journal_service_1.JournalService.getUserJournal(user.id);
                res.json(entry);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    // ✏️ Modifier le journal de l'utilisateur
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { contenu } = req.body;
                const updated = yield Journal_service_1.JournalService.updateUserJournal(user.id, contenu);
                res.json(updated);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    // ❌ Supprimer le journal de l'utilisateur
    static remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                yield Journal_service_1.JournalService.deleteUserJournal(user.id);
                res.json({ message: "Journal supprimé" });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
}
exports.JournalController = JournalController;
