// src/modules/journal/Journal.controller.ts
import { Request, Response } from "express";
import { JournalService } from "./Journal.service";

export class JournalController {
  // ➕ Créer/MàJ le journal de l'utilisateur connecté
  static async upsert(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { contenu } = req.body;
      if (!user?.id || typeof contenu !== "string") {
        return res.status(400).json({ error: "Contenu requis" });
      }
      const journal = await JournalService.upsertUserJournal(user.id, contenu);
      res.status(201).json(journal);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // 📖 Récupérer le journal de l'utilisateur connecté
  static async me(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const entry = await JournalService.getUserJournal(user.id);
      res.json(entry);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // ✏️ Modifier le journal de l'utilisateur
  static async update(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { contenu } = req.body;
      const updated = await JournalService.updateUserJournal(user.id, contenu);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // ❌ Supprimer le journal de l'utilisateur
  static async remove(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      await JournalService.deleteUserJournal(user.id);
      res.json({ message: "Journal supprimé" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
