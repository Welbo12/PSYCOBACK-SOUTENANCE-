import pool from "../../shared/database/client";
import { IJournal } from "./Journal.model";

export class JournalRepository {
  // Créer ou mettre à jour le journal d'un utilisateur (1 journal par utilisateur)
  static async createOrUpdate(utilisateurId: string, contenu: string) {
    const result = await pool.query(
      `INSERT INTO journal (utilisateur_id, contenu)
       VALUES ($1, $2)
       ON CONFLICT (utilisateur_id)
       DO UPDATE SET contenu = EXCLUDED.contenu
       RETURNING *`,
      [utilisateurId, contenu]
    );
    return result.rows[0];
  }

  // Récupérer le journal d’un utilisateur
  static async findByUser(utilisateurId: string) {
    const result = await pool.query(
      `SELECT * FROM journal WHERE utilisateur_id = $1`,
      [utilisateurId]
    );
    return result.rows[0] || null;
  }

  // Mettre à jour le journal par utilisateur
  static async updateByUser(utilisateurId: string, contenu: string) {
    const result = await pool.query(
      `UPDATE journal SET contenu = $2 WHERE utilisateur_id = $1 RETURNING *`,
      [utilisateurId, contenu]
    );
    return result.rows[0] || null;
  }

  // Supprimer le journal par utilisateur
  static async deleteByUser(utilisateurId: string) {
    await pool.query(`DELETE FROM journal WHERE utilisateur_id = $1`, [utilisateurId]);
  }
}
