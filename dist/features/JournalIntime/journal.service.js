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
// src/modules/journal/Journal.service.tsrepository
const Journal_repository_1 = require("./Journal.repository");
const Auth_repository_1 = require("../auth/Auth.repository"); // pour vérifier si user existe
class JournalService {
    //  Créer/MàJ le journal de l'utilisateur (un seul journal par user)
    static upsertUserJournal(utilisateurId, contenu) {
        return __awaiter(this, void 0, void 0, function* () {
            // Vérifier si l'utilisateur existe via son id
            const exists = yield Auth_repository_1.AuthRepository.findAllUsers();
            const found = exists.find((u) => u.id === utilisateurId);
            if (!found)
                throw new Error("Utilisateur introuvable");
            return yield Journal_repository_1.JournalRepository.createOrUpdate(utilisateurId, contenu);
        });
    }
    //  Récupérer le journal de l’utilisateur
    static getUserJournal(utilisateurId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Journal_repository_1.JournalRepository.findByUser(utilisateurId);
        });
    }
    //  Modifier le journal (par utilisateur)
    static updateUserJournal(utilisateurId, contenu) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield Journal_repository_1.JournalRepository.updateByUser(utilisateurId, contenu);
            if (!updated)
                throw new Error("Journal introuvable");
            return updated;
        });
    }
    //  Supprimer le journal de l’utilisateur
    static deleteUserJournal(utilisateurId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Journal_repository_1.JournalRepository.deleteByUser(utilisateurId);
        });
    }
}
exports.JournalService = JournalService;
