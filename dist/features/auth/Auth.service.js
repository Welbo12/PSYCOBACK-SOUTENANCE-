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
exports.RegisterPatientService = void 0;
const Auth_repository_1 = require("./Auth.repository");
const hashUtils_1 = require("../../shared/utils/hashUtils");
const cryptUtils_1 = require("../../shared/utils/cryptUtils");
class RegisterPatientService {
    static registerPatient(pseudonyme, motDePasse, email, role) {
        return __awaiter(this, void 0, void 0, function* () {
            // Crypter l'email et hasher le mot de passe
            const encryptedEmail = yield (0, cryptUtils_1.cryptEmail)(email);
            const hashedPassword = yield (0, hashUtils_1.hashPassword)(motDePasse);
            // Créer un nouvel utilisateur
            const user = yield Auth_repository_1.AuthRepository.createPatient(pseudonyme, hashedPassword, encryptedEmail, role);
            return user;
        });
    }
    static login(email, motDePasse) {
        return __awaiter(this, void 0, void 0, function* () {
            // Crypter l'email fourni par l'utilisateur
            const encryptedEmail = yield (0, cryptUtils_1.cryptEmail)(email);
            // Rechercher l'utilisateur dans la base de données avec l'email crypté
            const user = yield Auth_repository_1.AuthRepository.findByMail(encryptedEmail);
            if (!user) {
                throw new Error("Utilisateur introuvable");
            }
            // Vérifier le mot de passe
            const isPasswordValid = yield (0, hashUtils_1.comparePassword)(motDePasse, user.motDePasse);
            if (!isPasswordValid) {
                throw new Error("Mot de passe incorrect");
            }
            return user;
        });
    }
    static loginByClearEmail(email, motDePasse) {
        return __awaiter(this, void 0, void 0, function* () {
            // Rechercher l'utilisateur dans la base de données avec l'email en clair
            const user = yield Auth_repository_1.AuthRepository.findByClearEmail(email);
            if (!user) {
                throw new Error("Utilisateur introuvable");
            }
            // Vérifier le mot de passe
            const isPasswordValid = yield (0, hashUtils_1.comparePassword)(motDePasse, user.motDePasse);
            if (!isPasswordValid) {
                throw new Error("Mot de passe incorrect");
            }
            return user;
        });
    }
}
exports.RegisterPatientService = RegisterPatientService;
