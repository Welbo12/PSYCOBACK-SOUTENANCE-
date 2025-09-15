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
    static createPatient(pseudonyme, motDePasse, email, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_1.default.query("INSERT INTO utilisateur (pseudonyme, motDePasse, email, role) VALUES ($1, $2, $3, $4) RETURNING *", [pseudonyme, motDePasse, email, role]);
            return result.rows[0]; // Retourne uniquement la première ligne insérée
        });
    }
    static findByMail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_1.default.query("SELECT * FROM utilisateur WHERE email = $1", [email]);
            return result.rows[0]; // Retourne uniquement la première ligne trouvée
        });
    }
    static findByClearEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_1.default.query("SELECT * FROM utilisateur WHERE email_clair = $1", [email]);
            return result.rows[0]; // Retourne uniquement la première ligne trouvée
        });
    }
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
    // Hash déterministe pour l'email (SHA-256)
    static hashEmail(email) {
        return crypto_1.default.createHash("sha256").update(email).digest("hex");
    }
    static findByMailClair(email_clair) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_1.default.query(`SELECT * FROM utilisateur WHERE email_clair = $1 LIMIT 1`, [email_clair]);
            if (result.rows.length === 0)
                return null;
            return result.rows[0];
        });
    }
    static createPsychologue(nom, prenom, motDePasse, email_clair, domaines, sujets, methodes, description, motivation, cvUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1️⃣ Créer l'utilisateur avec rôle 'psychologue'
            const userResult = yield client_1.default.query(`INSERT INTO utilisateur (nom, prenom,  pseudonyme, motdepasse, email, email_clair, role, datecreation)
     VALUES ($1, $2,NULL, $3, NULL, $4, 'psychologue', now())
     RETURNING id, nom, prenom, role`, [nom, prenom, motDePasse, email_clair]);
            const user = userResult.rows[0];
            // 2️⃣ Créer le profil du psychologue
            yield client_1.default.query(`INSERT INTO therapist_profile (user_id, domaines, sujets, methodes, description, motivation, cv_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
                user.id,
                domaines,
                sujets,
                methodes,
                description,
                motivation,
                cvUrl || null
            ]);
            return user;
        });
    }
}
exports.AuthRepository = AuthRepository;
