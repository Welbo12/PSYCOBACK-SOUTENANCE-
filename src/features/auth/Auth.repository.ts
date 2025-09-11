
import pool from "../../shared/database/client";
import crypto from "crypto";

export class AuthRepository {
    static async createPatient(pseudonyme: string, motDePasse: string, email: string, role: string) {
        const result = await pool.query(
            "INSERT INTO utilisateur (pseudonyme, motDePasse, email, role) VALUES ($1, $2, $3, $4) RETURNING *",
            [pseudonyme, motDePasse, email, role]
        );
        return result.rows[0]; // Retourne uniquement la première ligne insérée
    }

    static async findByMail(email: string) {
        const result = await pool.query(
            "SELECT * FROM utilisateur WHERE email = $1",
            [email]
        );
        return result.rows[0]; // Retourne uniquement la première ligne trouvée
    }

    static async findByClearEmail(email: string) {
        const result = await pool.query(
            "SELECT * FROM utilisateur WHERE email_clair = $1",
            [email]
        );
        return result.rows[0]; // Retourne uniquement la première ligne trouvée
    }

    // Hash déterministe pour l'email (SHA-256)
    static hashEmail(email: string): string {
        return crypto.createHash("sha256").update(email).digest("hex");
    }
}