// src/modules/journal/Journal.service.ts
import { JournalRepository } from "./Journal.repository";
import { IJournal } from "./Journal.model";
import { AuthRepository } from "../auth/Auth.repository"; // pour vérifier si user existe

export class JournalService {
  // ➤ Créer une nouvelle entrée de journal
  static async createEntry(utilisateurId: string, contenu: string): Promise<IJournal> {
    // Vérifier si l'utilisateur existe
    const users = await AuthRepository.findAllUsers();
    const found = users.find((u: any) => u.id === utilisateurId);
    if (!found) throw new Error("Utilisateur introuvable");

    return await JournalRepository.create(utilisateurId, contenu);
  }

  // ➤ Récupérer toutes les entrées d’un utilisateur
  static async getUserEntries(utilisateurId: string): Promise<IJournal[]> {
    return await JournalRepository.findByUser(utilisateurId);
  }

  // ➤ Modifier une entrée spécifique
  static async updateEntry(id: string, contenu: string): Promise<IJournal> {
    const updated = await JournalRepository.updateById(id, contenu);
    if (!updated) throw new Error("Entrée introuvable");
    return updated;
  }

  // ➤ Supprimer une entrée spécifique
  static async deleteEntry(id: string): Promise<void> {
    return await JournalRepository.deleteById(id);
  }
}
