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
exports.JournalService = void 0;
// src/modules/journal/Journal.service.ts
const Journal_repository_1 = require("./Journal.repository");
const Auth_repository_1 = require("../auth/Auth.repository"); // pour vérifier si user existe
class JournalService {
    // ➤ Créer une nouvelle entrée de journal
    static createEntry(utilisateurId, contenu) {
        return __awaiter(this, void 0, void 0, function* () {
            // Vérifier si l'utilisateur existe
            const users = yield Auth_repository_1.AuthRepository.findAllUsers();
            const found = users.find((u) => u.id === utilisateurId);
            if (!found)
                throw new Error("Utilisateur introuvable");
            return yield Journal_repository_1.JournalRepository.create(utilisateurId, contenu);
        });
    }
    // ➤ Récupérer toutes les entrées d’un utilisateur
    static getUserEntries(utilisateurId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Journal_repository_1.JournalRepository.findByUser(utilisateurId);
        });
    }
    // ➤ Modifier une entrée spécifique
    static updateEntry(id, contenu) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield Journal_repository_1.JournalRepository.updateById(id, contenu);
            if (!updated)
                throw new Error("Entrée introuvable");
            return updated;
        });
    }
    // ➤ Supprimer une entrée spécifique
    static deleteEntry(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Journal_repository_1.JournalRepository.deleteById(id);
        });
    }
}
exports.JournalService = JournalService;
