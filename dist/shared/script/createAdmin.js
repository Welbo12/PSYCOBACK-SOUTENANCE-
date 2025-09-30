"use strict";
// import pool from "../database/client";
// import { hashPassword } from "../utils/hashUtils";
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
// export interface CreatedAdmin {
//   id: string;
//   pseudonyme: string;
//   email_clair: string | null;
//   role: string;
// }
// /**
//  * Crée un compte administrateur en base de données.
//  * - Insère dans `utilisateur` avec role = 'admin'
//  * - Insère la ligne correspondante dans `administrateur`
//  */
// export async function createAdmin(
//   email: string,
//   password: string,
//   pseudonyme = "admin"
// ): Promise<CreatedAdmin> {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");
//     // 1) Hasher le mot de passe
//     const hashedPassword = await hashPassword(password);
//     // 2) Insérer l'utilisateur admin
//     const insertUserSql = `
//       INSERT INTO utilisateur (pseudonyme, motdepasse, email_clair, role)
//       VALUES ($1, $2, $3, 'admin')
//       RETURNING id, pseudonyme, email_clair, role;
//     `;
//     const userRes = await client.query(insertUserSql, [pseudonyme, hashedPassword, email]);
//     const adminUser = userRes.rows[0] as CreatedAdmin;
//     // 3) Insérer dans la table administrateur
//     await client.query(`INSERT INTO administrateur (id) VALUES ($1)`, [adminUser.id]);
//     await client.query("COMMIT");
//     return adminUser;
//   } catch (err) {
//     await client.query("ROLLBACK");
//     // Relayer l'erreur pour gestion en amont
//     throw err;
//   } finally {
//     client.release();
//   }
// }
// // Exécution directe (script): utiliser variables d'environnement
// // ADMIN_EMAIL et ADMIN_PASSWORD, optionnel ADMIN_PSEUDONYME
// if (require.main === module) {
//   const email = process.env.ADMIN_EMAIL;
//   const password = process.env.ADMIN_PASSWORD;
//   const pseudonyme = process.env.ADMIN_PSEUDONYME || "admin";
//   if (!email || !password) {
//     console.error("ADMIN_EMAIL et ADMIN_PASSWORD sont requis");
//     process.exit(1);
//   }
//   createAdmin(email, password, pseudonyme)
//     .then((admin) => {
//       console.log("Administrateur créé:", admin);
//       process.exit(0);
//     })
//     .catch((e) => {
//       console.error("Erreur création admin:", e);
//       process.exit(1);
//     });
// }
const client_1 = __importDefault(require("../database/client"));
const hashUtils_1 = require("../utils/hashUtils");
/**
 * Crée un compte administrateur en base de données si non existant.
 * Retourne l'admin (avec flag alreadyExisted = true si déjà là).
 */
function createAdmin(email_1, password_1) {
    return __awaiter(this, arguments, void 0, function* (email, password, pseudonyme = "admin") {
        const client = yield client_1.default.connect();
        try {
            yield client.query("BEGIN");
            // 🔹 0) Vérifier si un utilisateur admin avec cet email existe déjà
            const checkSql = `
      SELECT id, pseudonyme, email_clair, role
      FROM utilisateur
      WHERE email_clair = $1 AND role = 'admin'
      LIMIT 1;
    `;
            const checkRes = yield client.query(checkSql, [email]);
            if (checkRes.rows.length > 0) {
                yield client.query("ROLLBACK"); // pas besoin de commit
                return Object.assign(Object.assign({}, checkRes.rows[0]), { alreadyExisted: true });
            }
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
            return Object.assign(Object.assign({}, adminUser), { alreadyExisted: false });
        }
        catch (err) {
            yield client.query("ROLLBACK");
            throw err;
        }
        finally {
            client.release();
        }
    });
}
// 🔹 Exécution directe (script CLI)
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
        if (admin.alreadyExisted) {
            console.log(` Admin déjà existant : ${admin.email_clair}`);
        }
        else {
            console.log(`Nouvel admin créé : ${admin.email_clair}`);
        }
        process.exit(0);
    })
        .catch((e) => {
        console.error("Erreur création admin:", e);
        process.exit(1);
    });
}
