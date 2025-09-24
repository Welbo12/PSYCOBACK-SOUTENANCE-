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
    // ➕ Créer une nouvelle entrée pour l'utilisateur connecté
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { contenu } = req.body;
                if (!(user === null || user === void 0 ? void 0 : user.id) || typeof contenu !== "string") {
                    return res.status(400).json({ error: "Contenu requis" });
                }
                const journal = yield Journal_service_1.JournalService.createEntry(user.id, contenu);
                res.status(201).json(journal);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    // 📖 Récupérer toutes les entrées du journal de l'utilisateur connecté
    static list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const entries = yield Journal_service_1.JournalService.getUserEntries(user.id);
                res.json(entries);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    // ✏️ Modifier une entrée spécifique par ID
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { contenu } = req.body;
                if (!id || typeof contenu !== "string") {
                    return res.status(400).json({ error: "ID et contenu requis" });
                }
                const updated = yield Journal_service_1.JournalService.updateEntry(id, contenu);
                res.json(updated);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    // ❌ Supprimer une entrée spécifique par ID
    static remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({ error: "ID requis" });
                }
                yield Journal_service_1.JournalService.deleteEntry(id);
                res.json({ message: "Entrée supprimée" });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
}
exports.JournalController = JournalController;
