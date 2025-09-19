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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterPatientService = void 0;
const Auth_repository_1 = require("./Auth.repository");
const hashUtils_1 = require("../../shared/utils/hashUtils");
const cryptUtils_1 = require("../../shared/utils/cryptUtils");
const emailUtils_1 = require("../../shared/utils/emailUtils");
const client_1 = __importDefault(require("../../shared/database/client"));
class RegisterPatientService {
    // ----------------------------
    // 1 Enregistrement patient
    // ----------------------------
    static registerPatient(pseudonyme, motDePasse, email, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!pseudonyme || !motDePasse || !email) {
                    throw new Error("Champs obligatoires manquants");
                }
                // Crypter l'email et hasher le mot de passe
                const encryptedEmail = yield (0, cryptUtils_1.cryptEmail)(email);
                const hashedPassword = yield (0, hashUtils_1.hashPassword)(motDePasse);
                // Créer un nouvel utilisateur patient
                const user = yield Auth_repository_1.AuthRepository.createPatient(pseudonyme, hashedPassword, encryptedEmail, role);
                return user;
            }
            catch (error) {
                // Gestion des erreurs de contrainte unique (Postgres)
                if (error.code === "23505") {
                    if (error.constraint === "utilisateur_pseudonyme_key") {
                        throw new Error("Ce pseudonyme est déjà utilisé. Veuillez en choisir un autre.");
                    }
                    else if (error.constraint === "utilisateur_email_key") {
                        throw new Error("Cette adresse email est déjà utilisée.");
                    }
                    else {
                        throw new Error("Cette information est déjà utilisée par un autre utilisateur.");
                    }
                }
                throw error;
            }
        });
    }
    // ----------------------------
    // 2️⃣ Login patient (email crypté)
    // ----------------------------
    static login(email, motDePasse) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield Auth_repository_1.AuthRepository.findAllUsers();
            let user = null;
            for (const u of users) {
                if (!u.email)
                    continue;
                const emailToCompare = Buffer.isBuffer(u.email)
                    ? u.email.toString()
                    : u.email;
                const isEmailValid = yield (0, cryptUtils_1.compareEmail)(email, emailToCompare);
                if (isEmailValid) {
                    user = u;
                    break;
                }
            }
            if (!user) {
                throw new Error("Utilisateur introuvable");
            }
            if (!user.motDePasse) {
                throw new Error("Compte utilisateur invalide - mot de passe manquant");
            }
            const isPasswordValid = yield (0, hashUtils_1.comparePassword)(motDePasse, user.motDePasse);
            if (!isPasswordValid) {
                throw new Error("Mot de passe incorrect");
            }
            return user;
        });
    }
    // ----------------------------
    // 3️⃣ Enregistrement psychologue
    // ----------------------------
    static registerPsychologue(nom, prenom, motDePasse, email_clair, domaines, sujets, methodes, description, motivation, cvUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!nom || !prenom || !motDePasse || !email_clair) {
                throw new Error("Champs obligatoires manquants");
            }
            // Vérif si mail déjà utilisé
            const existing = yield Auth_repository_1.AuthRepository.findByClearEmail(email_clair);
            if (existing) {
                throw new Error("Un utilisateur avec cet email existe déjà");
            }
            // Hash mot de passe
            const hashedPassword = yield (0, hashUtils_1.hashPassword)(motDePasse);
            // Création en BDD ( pas de pseudonyme ici)
            const user = yield Auth_repository_1.AuthRepository.createPsychologue(nom, prenom, hashedPassword, email_clair, domaines, sujets, methodes, description, motivation, cvUrl);
            return user;
        });
    }
    // ----------------------------
    // Login psychologue (email clair)
    // ----------------------------
    static loginByClearEmail(email_clair, motDePasse) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Auth_repository_1.AuthRepository.findByClearEmail(email_clair);
            if (!user) {
                throw new Error("Utilisateur introuvable");
            }
            const isPasswordValid = yield (0, hashUtils_1.comparePassword)(motDePasse, user.motDePasse);
            if (!isPasswordValid) {
                throw new Error("Mot de passe incorrect");
            }
            return user;
        });
    }
    // ----------------------------
    //  Génération OTP
    // ----------------------------
    static generateOTP(length = 6) {
        let otp = "";
        for (let i = 0; i < length; i++)
            otp += Math.floor(Math.random() * 10);
        return otp;
    }
    // ----------------------------
    //  Envoi OTP (seulement psy/admin)
    // ----------------------------
    static sendOTP(userId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1) Vérifier rôle + récupérer email clair AVANT de créer l'OTP
            const result = yield client_1.default.query("SELECT role, email_clair FROM utilisateur WHERE id = $1", [userId]);
            const user = result.rows[0];
            if (!user)
                throw new Error("Utilisateur introuvable");
            if (user.role !== "psychologue" && user.role !== "admin") {
                throw new Error("OTP par email non disponible pour ce type d'utilisateur");
            }
            if (!user.email_clair) {
                throw new Error("Adresse email claire introuvable");
            }
            // 2) Générer et enregistrer l'OTP une seule fois avec le type demandé
            const otp = this.generateOTP();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
            yield Auth_repository_1.AuthRepository.createOTP({ userId, otp, type, expiresAt });
            // 3) Envoyer l'email OTP
            yield (0, emailUtils_1.sendOtpEmail)(user.email_clair, otp);
            return { message: `OTP ${type} envoyé` };
        });
    }
    // ----------------------------
    // 7️⃣ Vérification OTP (sans action)
    // ----------------------------
    static verifyOTP(userId, otp, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield Auth_repository_1.AuthRepository.findValidOTP(userId, otp, type);
            if (!record)
                throw new Error("OTP invalide ou expiré");
            if (type === "activation") {
                // Marquer utilisateur comme vérifié
                yield client_1.default.query("UPDATE utilisateur SET verified = true WHERE id = $1", [
                    userId,
                ]);
                // Marquer OTP comme utilisé
                yield Auth_repository_1.AuthRepository.markOTPUsed(record.id);
            }
            // Pour le reset, on ne fait que vérifier l'OTP, on ne le marque pas comme utilisé encore
            return {
                message: type === "activation" ? "Compte vérifié" : "OTP validé, vous pouvez maintenant réinitialiser votre mot de passe",
            };
        });
    }
    // ----------------------------
    // 8️⃣ Reset password après vérification OTP
    // ----------------------------
    static resetPasswordAfterOTP(userId, otp, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            // Vérifier que l'OTP est valide et non utilisé
            const record = yield Auth_repository_1.AuthRepository.findValidOTP(userId, otp, "reset");
            if (!record)
                throw new Error("OTP invalide ou expiré");
            // Hasher le nouveau mot de passe
            const hashedPassword = yield (0, hashUtils_1.hashPassword)(newPassword);
            // Mettre à jour le mot de passe
            yield client_1.default.query("UPDATE utilisateur SET motdepasse = $1 WHERE id = $2", [hashedPassword, userId]);
            // Marquer OTP comme utilisé
            yield Auth_repository_1.AuthRepository.markOTPUsed(record.id);
            return {
                message: "Mot de passe réinitialisé avec succès",
            };
        });
    }
    // Helpers to support email_clair controller
    static sendOTPByEmailClair(email_clair, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Auth_repository_1.AuthRepository.findByClearEmail(email_clair);
            if (!user)
                throw new Error("Utilisateur introuvable");
            return this.sendOTP(user.id, type);
        });
    }
    static verifyOTPByEmailClair(email_clair, otp, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Auth_repository_1.AuthRepository.findByClearEmail(email_clair);
            if (!user)
                throw new Error("Utilisateur introuvable");
            return this.verifyOTP(user.id, otp, type);
        });
    }
    static resetPasswordByEmailClair(email_clair, otp, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Auth_repository_1.AuthRepository.findByClearEmail(email_clair);
            if (!user)
                throw new Error("Utilisateur introuvable");
            return this.resetPasswordAfterOTP(user.id, otp, newPassword);
        });
    }
}
exports.RegisterPatientService = RegisterPatientService;
