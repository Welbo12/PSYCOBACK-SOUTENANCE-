import pool from "../../shared/database/client";
import { IJournal } from "./Journal.model";

export class JournalRepository {
  // ➤ Créer une nouvelle entrée dans le journal
  static async create(utilisateurId: string, contenu: string): Promise<IJournal> {
    const result = await pool.query(
      `INSERT INTO journal_entries (utilisateur_id, contenu)
       VALUES ($1, $2)
       RETURNING *`,
      [utilisateurId, contenu]
    );
    return result.rows[0];
  }

  // ➤ Récupérer toutes les entrées d’un utilisateur (ordre chronologique inverse)
  static async findByUser(utilisateurId: string): Promise<IJournal[]> {
    const result = await pool.query(
      `SELECT * FROM journal_entries
       WHERE utilisateur_id = $1
       ORDER BY date_creation DESC`,
      [utilisateurId]
    );
    return result.rows;
  }

  // ➤ Mettre à jour une entrée spécifique par son id
  static async updateById(id: string, contenu: string): Promise<IJournal | null> {
    const result = await pool.query(
      `UPDATE journal_entries
       SET contenu = $2
       WHERE id = $1
       RETURNING *`,
      [id, contenu]
    );
    return result.rows[0] || null;
  }

  // ➤ Supprimer une entrée spécifique
  static async deleteById(id: string): Promise<void> {
    await pool.query(
      `DELETE FROM journal_entries WHERE id = $1`,
      [id]
    );
  }
}
