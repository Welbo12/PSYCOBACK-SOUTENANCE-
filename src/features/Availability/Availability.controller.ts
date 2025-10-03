import { Request, Response } from "express";
import { AvailabilityService } from "./Availability.service";

export const AvailabilityController = {
  async createOrUpdate(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const payload = { ...req.body, providerId: user?.id };
      const result = await AvailabilityService.saveSlots(payload);
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const providerId = req.params.providerId;
      console.log(`🔍 Recherche des disponibilités pour providerId: ${providerId}`);
      
      if (!providerId) {
        return res.status(400).json({ message: "providerId requis" });
      }
      
      const rows = await AvailabilityService.list(providerId);
      console.log(`📊 Nombre de créneaux trouvés: ${rows.length}`);
      
      res.status(200).json({
        success: true,
        data: rows,
        count: rows.length,
        providerId: providerId
      });
    } catch (error: any) {
      console.error("❌ Erreur lors de la récupération des disponibilités:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erreur serveur lors de la récupération des disponibilités",
        error: error.message 
      });
    }
  },

  async remove(req: Request, res: Response) {
    const providerId = req.params.providerId;
    const iso = req.params.iso;
    if (!providerId || !iso) return res.status(400).json({ message: "paramètres manquants" });
    const deleted = await AvailabilityService.removeSlot(providerId, iso);
    res.status(200).json({ deleted });
  },

  // Endpoint de test pour insérer des données de test
  async createTestData(req: Request, res: Response) {
    try {
      const providerId = req.params.providerId || "psy-123";
      const now = new Date();
      const testSlots = [
        new Date(now.getTime() + 24 * 60 * 60 * 1000), // Demain
        new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // Après-demain
        new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // Dans 3 jours
      ];

      const payload = {
        providerId,
        slots: testSlots.map(date => ({ iso: date.toISOString() }))
      };

      const result = await AvailabilityService.saveSlots(payload);
      res.status(200).json({ 
        success: true, 
        message: "Données de test créées avec succès",
        providerId,
        inserted: result.inserted,
        testSlots: testSlots.map(d => d.toISOString())
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};


