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
    // 1️ Créer un patient
    // -----------------------------
    static createPatient(pseudonyme, motdepasse, email, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_1.default.query("INSERT INTO utilisateur (pseudonyme, motdepasse, email, role) VALUES ($1, $2, $3, $4) RETURNING *", [pseudonyme, motdepasse, email, role]);
            return result.rows[0];
        });
    }
    // -----------------------------
    // 2 Chercher patient par email
    // -----------------------------
    static findByMail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_1.default.query("SELECT * FROM utilisateur WHERE email = $1", [email]);
            return result.rows[0];
        });
    }
    // -----------------------------
    // 3️ Lister tous les utilisateurs
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
    // Compter les patients (role = 'patient')
    // -----------------------------
    static countPatients() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const result = yield client_1.default.query(`SELECT COUNT(*)::int AS count FROM utilisateur WHERE role = 'patient'`);
            return (_b = (_a = result.rows[0]) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
        });
    }
    // -----------------------------
    // Compter les psychologues (role = 'psychologue')
    // -----------------------------
    static countPsychologues() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const result = yield client_1.default.query(`SELECT COUNT(*)::int AS count FROM utilisateur WHERE role = 'psychologue'`);
            return (_b = (_a = result.rows[0]) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
        });
    }
    // -----------------------------
    // 4 Hash déterministe pour email
    // -----------------------------
    static hashEmail(email) {
        return crypto_1.default.createHash("sha256").update(email).digest("hex");
    }
    // -----------------------------
    // Créer un psychologue
    // -----------------------------
    static createPsychologue(nom, prenom, motdepasse, // changer ici aussi
    email_clair, domaines, sujets, methodes, description, motivation, cvUrl, photoUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            // Créer l'utilisateur psychologue
            const userResult = yield client_1.default.query(`INSERT INTO utilisateur (nom, prenom, pseudonyme, motdepasse, email, email_clair, role, datecreation)
       VALUES ($1, $2, NULL, $3, NULL, $4, 'psychologue', now())
       RETURNING id, nom, prenom, role`, [nom, prenom, motdepasse, email_clair]);
            const user = userResult.rows[0];
            // Créer le profil
            yield client_1.default.query(`INSERT INTO therapist_profile (user_id, domaines, sujets, methodes, description, motivation, cv_url, photo_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [user.id, domaines, sujets, methodes, description, motivation, cvUrl || null, photoUrl || null]);
            // Créer l'entrée Psychologue avec statutVerification = FALSE par défaut
            yield client_1.default.query(`INSERT INTO psychologue (id, statutverification, disponibilite)
       VALUES ($1, FALSE, TRUE)`, [user.id]);
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
    // -----------------------------
    // 7️⃣ Lister les candidatures psychologues
    // -----------------------------
    static listPsychologistApplications() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_1.default.query(`SELECT 
         u.id,
         u.nom,
         u.prenom,
         u.email_clair,
         u.datecreation as "dateCreation",
         p.statutverification as "statutVerification",
         tp.domaines,
         tp.sujets,
         tp.methodes,
         tp.description,
         tp.motivation,
         tp.cv_url as "cvUrl",
         tp.photo_url as "photoUrl"
       FROM utilisateur u
       JOIN psychologue p ON p.id = u.id
       LEFT JOIN therapist_profile tp ON tp.user_id = u.id
       WHERE u.role = 'psychologue'
       ORDER BY u.datecreation DESC`);
            return result.rows;
        });
    }
    // -----------------------------
    // 8️⃣ Approuver un psychologue (statutverification = TRUE)
    // -----------------------------
    static approvePsychologist(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield client_1.default.query(`UPDATE psychologue SET statutverification = TRUE WHERE id = $1`, [userId]);
        });
    }
}
exports.AuthRepository = AuthRepository;
