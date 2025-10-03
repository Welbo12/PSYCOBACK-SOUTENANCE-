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
    const providerId = req.params.providerId;
    if (!providerId) return res.status(400).json({ message: "providerId requis" });
    const rows = await AvailabilityService.list(providerId);
    res.status(200).json(rows);
  },

  async remove(req: Request, res: Response) {
    const providerId = req.params.providerId;
    const iso = req.params.iso;
    if (!providerId || !iso) return res.status(400).json({ message: "paramètres manquants" });
    const deleted = await AvailabilityService.removeSlot(providerId, iso);
    res.status(200).json({ deleted });
  },
};


