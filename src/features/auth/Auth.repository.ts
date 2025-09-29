

import pool from "../../shared/database/client";
import crypto from "crypto";
import { IUser } from "./Auth.model";
import { IOTP } from "./Auth.model";

export class AuthRepository {
  // -----------------------------
  // 1️ Créer un patient
  // -----------------------------
  static async createPatient(
    pseudonyme: string,
    motdepasse: string,
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
  // 2 Chercher patient par email
  // -----------------------------
  static async findByMail(email: string) {
    const result = await pool.query(
      "SELECT * FROM utilisateur WHERE email = $1",
      [email]
    );
    return result.rows[0];
  }

  // -----------------------------
  // 3️ Lister tous les utilisateurs
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

    // Compter les patients (role = 'patient')
  // -----------------------------
  static async countPatients(): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*)::int AS count FROM utilisateur WHERE role = 'patient'`
    );
    return result.rows[0]?.count ?? 0;
  }
 // -----------------------------
  // Compter les psychologues (role = 'psychologue')
  // -----------------------------
  static async countPsychologues(): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*)::int AS count FROM utilisateur WHERE role = 'psychologue'`
    );
    return result.rows[0]?.count ?? 0;
  }


  // -----------------------------
  // 4 Hash déterministe pour email
  // -----------------------------
  static hashEmail(email: string): string {
    return crypto.createHash("sha256").update(email).digest("hex");
  }

  // -----------------------------
  // Créer un psychologue
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

     // Créer l'entrée Psychologue avec statutVerification = FALSE par défaut
    await pool.query(
      `INSERT INTO psychologue (id, statutverification, disponibilite)
       VALUES ($1, FALSE, TRUE)`,
      [user.id]
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


  static async createOTP(otpData: IOTP) {
    const result = await pool.query(
      `INSERT INTO otp_verification (user_id, otp, type, expires_at, used)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [otpData.userId, otpData.otp, otpData.type, otpData.expiresAt, otpData.used || false]
    );
    return result.rows[0];
  }

  static async findValidOTP(userId: string, otp: string, type: "activation" | "reset") {
    const result = await pool.query(
      `SELECT * FROM otp_verification 
       WHERE user_id = $1 AND otp = $2 AND type = $3 AND used = false AND expires_at > now()`,
      [userId, otp, type]
    );
    return result.rows[0];
  }

  static async markOTPUsed(id: number) {
    await pool.query(
      `UPDATE otp_verification SET used = true WHERE id = $1`,
      [id]
    );
  }

  // -----------------------------
  // 7️⃣ Lister les candidatures psychologues
  // -----------------------------
  static async listPsychologistApplications() {
    const result = await pool.query(
      `SELECT 
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
         tp.cv_url as "cvUrl"
       FROM utilisateur u
       JOIN psychologue p ON p.id = u.id
       LEFT JOIN therapist_profile tp ON tp.user_id = u.id
       WHERE u.role = 'psychologue'
       ORDER BY u.datecreation DESC`
    );
    return result.rows;
  }

  // -----------------------------
  // 8️⃣ Approuver un psychologue (statutverification = TRUE)
  // -----------------------------
  static async approvePsychologist(userId: string) {
    await pool.query(
      `UPDATE psychologue SET statutverification = TRUE WHERE id = $1`,
      [userId]
    );
  }



}
