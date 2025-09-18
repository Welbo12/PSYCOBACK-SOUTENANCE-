// src/modules/journal/Journal.service.tsrepository
import { JournalRepository } from "./Journal.repository";
import { IJournal } from "./Journal.model";
import { AuthRepository } from "../auth/Auth.repository"; // pour vérifier si user existe

export class JournalService {
  //  Créer/MàJ le journal de l'utilisateur (un seul journal par user)
  static async upsertUserJournal(utilisateurId: string, contenu: string) {
    // Vérifier si l'utilisateur existe via son id
    const exists = await AuthRepository.findAllUsers();
    const found = exists.find((u: any) => u.id === utilisateurId);
    if (!found) throw new Error("Utilisateur introuvable");
    return await JournalRepository.createOrUpdate(utilisateurId, contenu);
  }

  //  Récupérer le journal de l’utilisateur
  static async getUserJournal(utilisateurId: string) {
    return await JournalRepository.findByUser(utilisateurId);
  }
  //  Modifier le journal (par utilisateur)
  static async updateUserJournal(utilisateurId: string, contenu: string) {
    const updated = await JournalRepository.updateByUser(utilisateurId, contenu);
    if (!updated) throw new Error("Journal introuvable");
    return updated;
  }

  //  Supprimer le journal de l’utilisateur
  static async deleteUserJournal(utilisateurId: string) {
    return await JournalRepository.deleteByUser(utilisateurId);
  }
}
