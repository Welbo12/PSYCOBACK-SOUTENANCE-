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
exports.createAdmin = createAdmin;
const client_1 = __importDefault(require("../database/client"));
const hashUtils_1 = require("../utils/hashUtils");
/**
 * Crée un compte administrateur en base de données.
 * - Insère dans `utilisateur` avec role = 'admin'
 * - Insère la ligne correspondante dans `administrateur`
 */
function createAdmin(email_1, password_1) {
    return __awaiter(this, arguments, void 0, function* (email, password, pseudonyme = "admin") {
        const client = yield client_1.default.connect();
        try {
            yield client.query("BEGIN");
            // 1) Hasher le mot de passe
            const hashedPassword = yield (0, hashUtils_1.hashPassword)(password);
            // 2) Insérer l'utilisateur admin
            const insertUserSql = `
      INSERT INTO utilisateur (pseudonyme, motdepasse, email_clair, role)
      VALUES ($1, $2, $3, 'admin')
      RETURNING id, pseudonyme, email_clair, role;
    `;
            const userRes = yield client.query(insertUserSql, [pseudonyme, hashedPassword, email]);
            const adminUser = userRes.rows[0];
            // 3) Insérer dans la table administrateur
            yield client.query(`INSERT INTO administrateur (id) VALUES ($1)`, [adminUser.id]);
            yield client.query("COMMIT");
            return adminUser;
        }
        catch (err) {
            yield client.query("ROLLBACK");
            // Relayer l'erreur pour gestion en amont
            throw err;
        }
        finally {
            client.release();
        }
    });
}
// Exécution directe (script): utiliser variables d'environnement
// ADMIN_EMAIL et ADMIN_PASSWORD, optionnel ADMIN_PSEUDONYME
if (require.main === module) {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const pseudonyme = process.env.ADMIN_PSEUDONYME || "admin";
    if (!email || !password) {
        console.error("ADMIN_EMAIL et ADMIN_PASSWORD sont requis");
        process.exit(1);
    }
    createAdmin(email, password, pseudonyme)
        .then((admin) => {
        console.log("Administrateur créé:", admin);
        process.exit(0);
    })
        .catch((e) => {
        console.error("Erreur création admin:", e);
        process.exit(1);
    });
}
