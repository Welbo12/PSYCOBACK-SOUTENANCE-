// src/modules/journal/Journal.controller.ts
import { Request, Response } from "express";
import { JournalService } from "./Journal.service";

export class JournalController {
  // ➕ Créer une nouvelle entrée pour l'utilisateur connecté
  static async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { contenu } = req.body;

      if (!user?.id || typeof contenu !== "string") {
        return res.status(400).json({ error: "Contenu requis" });
      }

      const journal = await JournalService.createEntry(user.id, contenu);
      res.status(201).json(journal);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // 📖 Récupérer toutes les entrées du journal de l'utilisateur connecté
  static async list(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const entries = await JournalService.getUserEntries(user.id);
      res.json(entries);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // ✏️ Modifier une entrée spécifique par ID
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { contenu } = req.body;

      if (!id || typeof contenu !== "string") {
        return res.status(400).json({ error: "ID et contenu requis" });
      }

      const updated = await JournalService.updateEntry(id, contenu);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // ❌ Supprimer une entrée spécifique par ID
  static async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "ID requis" });
      }

      await JournalService.deleteEntry(id);
      res.json({ message: "Entrée supprimée" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
