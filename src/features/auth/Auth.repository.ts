// import pool from "../../shared/database/client";
// import crypto from "crypto";
// import { IUser } from "./Auth.model";

// export class AuthRepository {
//   static async createPatient(
//     pseudonyme: string,
//     motDePasse: string,
//     email: string,
//     role: string
//   ) {
//     const result = await pool.query(
//       "INSERT INTO utilisateur (pseudonyme, motDePasse, email, role) VALUES ($1, $2, $3, $4) RETURNING *",
//       [pseudonyme, motDePasse, email, role]
//     );
//     return result.rows[0]; // Retourne uniquement la première ligne insérée
//   }

//   static async findByMail(email: string) {
//     const result = await pool.query(
//       "SELECT * FROM utilisateur WHERE email = $1",
//       [email]
//     );
//     return result.rows[0]; // Retourne uniquement la première ligne trouvée
//   }

//   static async findAllUsers() {
//     const result = await pool.query(
//       `SELECT 
//                 id,
//                 pseudonyme,
//                 motdepasse as "motDePasse",
//                 email,
//                 email_clair,
//                 datecreation as "dateCreation",
//                 role
//             FROM utilisateur`
//     );
//     return result.rows;
//   }

//   // Hash déterministe pour l'email (SHA-256)
//   static hashEmail(email: string): string {
//     return crypto.createHash("sha256").update(email).digest("hex");
//   }

//   static async createPsychologue(
//     nom: string,
//     prenom: string,
//     motDePasse: string,
//     email_clair: string,
//     domaines: string[],
//     sujets: string[],
//     methodes: string[],
//     description: string,
//     motivation: string,
//     cvUrl?: string
//   ) {
//     // 1️⃣ Créer l'utilisateur avec rôle 'psychologue'

//     const userResult = await pool.query(
//       `INSERT INTO utilisateur (nom, prenom,  pseudonyme, motdepasse, email, email_clair, role, datecreation)
//      VALUES ($1, $2,NULL, $3, NULL, $4, 'psychologue', now())
//      RETURNING id, nom, prenom, role`,
//       [nom, prenom, motDePasse, email_clair]
//     );
//     const user = userResult.rows[0];

//     // 2️⃣ Créer le profil du psychologue
//     await pool.query(
//       `INSERT INTO therapist_profile (user_id, domaines, sujets, methodes, description, motivation, cv_url)
//          VALUES ($1, $2, $3, $4, $5, $6, $7)`,
//       [
//         user.id,
//         domaines,
//         sujets,
//         methodes,
//         description,
//         motivation,
//         cvUrl || null,
//       ]
//     );

//     return user;
//   }

//   static async findByClearEmail(email_clair: string) {
//     const result = await pool.query(
//       "SELECT * FROM utilisateur WHERE email_clair = $1",
//       [email_clair]
//     );
//     return result.rows[0]; // Retourne uniquement la première ligne trouvée
//   }
// }
import pool from "../../shared/database/client";
import crypto from "crypto";
import { IUser } from "./Auth.model";

export class AuthRepository {
  // -----------------------------
  // 1️⃣ Créer un patient
  // -----------------------------
  static async createPatient(
    pseudonyme: string,
    motdepasse: string, // changer ici
    email: string,
    role: string
  ) {
    const result = await pool.query(
      "INSERT INTO utilisateur (pseudonyme, motdepasse, email, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [pseudonyme, motdepasse, email, role]
    );
    return result.rows[0];
  }

  // -----------------------------
  // 2️⃣ Chercher patient par email
  // -----------------------------
  static async findByMail(email: string) {
    const result = await pool.query(
      "SELECT * FROM utilisateur WHERE email = $1",
      [email]
    );
    return result.rows[0];
  }

  // -----------------------------
  // 3️⃣ Lister tous les utilisateurs
  // -----------------------------
  static async findAllUsers() {
    const result = await pool.query(
      `SELECT 
        id,
        pseudonyme,
        motdepasse as "motDePasse", 
        email,
        email_clair,
        datecreation as "dateCreation",
        role
     FROM utilisateur`
    );
    return result.rows;
  }

  // -----------------------------
  // 4️⃣ Hash déterministe pour email
  // -----------------------------
  static hashEmail(email: string): string {
    return crypto.createHash("sha256").update(email).digest("hex");
  }

  // -----------------------------
  // 5️⃣ Créer un psychologue
  // -----------------------------
  static async createPsychologue(
    nom: string,
    prenom: string,
    motdepasse: string, // changer ici aussi
    email_clair: string,
    domaines: string[],
    sujets: string[],
    methodes: string[],
    description: string,
    motivation: string,
    cvUrl?: string
  ) {
    // Créer l'utilisateur psychologue
    const userResult = await pool.query(
      `INSERT INTO utilisateur (nom, prenom, pseudonyme, motdepasse, email, email_clair, role, datecreation)
       VALUES ($1, $2, NULL, $3, NULL, $4, 'psychologue', now())
       RETURNING id, nom, prenom, role`,
      [nom, prenom, motdepasse, email_clair]
    );
    const user = userResult.rows[0];

    // Créer le profil
    await pool.query(
      `INSERT INTO therapist_profile (user_id, domaines, sujets, methodes, description, motivation, cv_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [user.id, domaines, sujets, methodes, description, motivation, cvUrl || null]
    );

    return user;
  }

  // -----------------------------
  // 6️⃣ Chercher psychologue par email clair
  // -----------------------------
  static async findByClearEmail(email_clair: string) {
    const result = await pool.query(
      `SELECT 
         id,
         pseudonyme,
         motdepasse as "motDePasse",
         email,
         email_clair,
         datecreation as "dateCreation",
         role
       FROM utilisateur
       WHERE email_clair = $1`,
      [email_clair]
    );
    return result.rows[0];
  }
}
