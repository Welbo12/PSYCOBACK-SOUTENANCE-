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
exports.AuthRepository = void 0;
const client_1 = __importDefault(require("../../shared/database/client"));
const crypto_1 = __importDefault(require("crypto"));
class AuthRepository {
    // -----------------------------
    // 1️⃣ Créer un patient
    // -----------------------------
    static createPatient(pseudonyme, motdepasse, email, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_1.default.query("INSERT INTO utilisateur (pseudonyme, motdepasse, email, role) VALUES ($1, $2, $3, $4) RETURNING *", [pseudonyme, motdepasse, email, role]);
            return result.rows[0];
        });
    }
    // -----------------------------
    // 2️⃣ Chercher patient par email
    // -----------------------------
    static findByMail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_1.default.query("SELECT * FROM utilisateur WHERE email = $1", [email]);
            return result.rows[0];
        });
    }
    // -----------------------------
    // 3️⃣ Lister tous les utilisateurs
    // -----------------------------
    static findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_1.default.query(`SELECT 
        id,
        pseudonyme,
        motdepasse as "motDePasse", 
        email,
        email_clair,
        datecreation as "dateCreation",
        role
     FROM utilisateur`);
            return result.rows;
        });
    }
    // -----------------------------
    // 4️⃣ Hash déterministe pour email
    // -----------------------------
    static hashEmail(email) {
        return crypto_1.default.createHash("sha256").update(email).digest("hex");
    }
    // -----------------------------
    // 5️⃣ Créer un psychologue
    // -----------------------------
    static createPsychologue(nom, prenom, motdepasse, // changer ici aussi
    email_clair, domaines, sujets, methodes, description, motivation, cvUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            // Créer l'utilisateur psychologue
            const userResult = yield client_1.default.query(`INSERT INTO utilisateur (nom, prenom, pseudonyme, motdepasse, email, email_clair, role, datecreation)
       VALUES ($1, $2, NULL, $3, NULL, $4, 'psychologue', now())
       RETURNING id, nom, prenom, role`, [nom, prenom, motdepasse, email_clair]);
            const user = userResult.rows[0];
            // Créer le profil
            yield client_1.default.query(`INSERT INTO therapist_profile (user_id, domaines, sujets, methodes, description, motivation, cv_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`, [user.id, domaines, sujets, methodes, description, motivation, cvUrl || null]);
            return user;
        });
    }
    // -----------------------------
    // 6️⃣ Chercher psychologue par email clair
    // -----------------------------
    static findByClearEmail(email_clair) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_1.default.query(`SELECT 
         id,
         pseudonyme,
         motdepasse as "motDePasse",
         email,
         email_clair,
         datecreation as "dateCreation",
         role
       FROM utilisateur
       WHERE email_clair = $1`, [email_clair]);
            return result.rows[0];
        });
    }
    static createOTP(otpData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_1.default.query(`INSERT INTO otp_verification (user_id, otp, type, expires_at, used)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`, [otpData.userId, otpData.otp, otpData.type, otpData.expiresAt, otpData.used || false]);
            return result.rows[0];
        });
    }
    static findValidOTP(userId, otp, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_1.default.query(`SELECT * FROM otp_verification 
       WHERE user_id = $1 AND otp = $2 AND type = $3 AND used = false AND expires_at > now()`, [userId, otp, type]);
            return result.rows[0];
        });
    }
    static markOTPUsed(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield client_1.default.query(`UPDATE otp_verification SET used = true WHERE id = $1`, [id]);
        });
    }
}
exports.AuthRepository = AuthRepository;
