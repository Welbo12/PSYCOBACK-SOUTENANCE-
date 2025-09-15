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
            try {
                // Crypter l'email et hasher le mot de passe
                const encryptedEmail = yield (0, cryptUtils_1.cryptEmail)(email);
                const hashedPassword = yield (0, hashUtils_1.hashPassword)(motDePasse);
                // Créer un nouvel utilisateur
                const user = yield Auth_repository_1.AuthRepository.createPatient(pseudonyme, hashedPassword, encryptedEmail, role);
                return user;
            }
            catch (error) {
                // Gestion des erreurs de contrainte unique
                if (error.code === '23505') {
                    if (error.constraint === 'utilisateur_pseudonyme_key') {
                        throw new Error("Ce pseudonyme est déjà utilisé. Veuillez en choisir un autre.");
                    }
                    else if (error.constraint === 'utilisateur_email_key') {
                        throw new Error("Cette adresse email est déjà utilisée.");
                    }
                    else {
                        throw new Error("Cette information est déjà utilisée par un autre utilisateur.");
                    }
                }
                // Relancer les autres erreurs
                throw error;
            }
        });
    }
    static login(email, motDePasse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("🔍 Tentative de connexion pour l'email:", email);
                // Récupérer tous les utilisateurs pour comparer les emails cryptés
                const users = yield Auth_repository_1.AuthRepository.findAllUsers();
                console.log("📊 Nombre d'utilisateurs trouvés:", users.length);
                let user = null;
                // Chercher l'utilisateur en comparant l'email crypté
                for (const u of users) {
                    try {
                        console.log(`🔍 Vérification utilisateur ${u.pseudonyme}:`, {
                            id: u.id,
                            email: u.email ? (u.email.includes(':') ? 'AES format' : 'bcrypt format') : 'NULL',
                            emailLength: u.email ? u.email.length : 0
                        });
                        if (!u.email) {
                            console.log(`⏭️  Utilisateur ${u.pseudonyme} n'a pas d'email, ignoré`);
                            continue;
                        }
                        const isEmailValid = yield (0, cryptUtils_1.compareEmail)(email, u.email);
                        if (isEmailValid) {
                            user = u;
                            console.log("✅ Utilisateur trouvé:", u.pseudonyme);
                            break;
                        }
                    }
                    catch (emailError) {
                        console.error("❌ Erreur lors de la comparaison d'email:", emailError);
                        console.error("❌ Détails utilisateur:", { id: u.id, pseudonyme: u.pseudonyme, email: u.email });
                        // Continue avec le prochain utilisateur
                    }
                }
                if (!user) {
                    console.log("❌ Aucun utilisateur trouvé pour cet email");
                    throw new Error("Utilisateur introuvable");
                }
                // Vérifier le mot de passe
                console.log("🔐 Vérification du mot de passe...");
                // Vérifier que le mot de passe existe et est valide
                if (!user.motDePasse ||
                    user.motDePasse.trim() === '' ||
                    user.motDePasse === 'null' ||
                    user.motDePasse === 'undefined') {
                    console.log("❌ L'utilisateur n'a pas de mot de passe valide enregistré");
                    console.log(`🔍 Détails utilisateur: ${user.pseudonyme} - Mot de passe: "${user.motDePasse}"`);
                    throw new Error("Compte utilisateur invalide - mot de passe manquant");
                }
                console.log("🔍 Mot de passe de l'utilisateur:", user.motDePasse ? "présent" : "absent");
                const isPasswordValid = yield (0, hashUtils_1.comparePassword)(motDePasse, user.motDePasse);
                if (!isPasswordValid) {
                    console.log("❌ Mot de passe incorrect");
                    throw new Error("Mot de passe incorrect");
                }
                console.log("✅ Connexion réussie pour:", user.pseudonyme);
                return user;
            }
            catch (error) {
                console.error("❌ Erreur dans login:", error);
                throw error;
            }
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
