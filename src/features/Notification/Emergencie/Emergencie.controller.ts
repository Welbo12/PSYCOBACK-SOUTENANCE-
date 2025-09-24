import { triggerEmergency } from "./Emergencie.service";
import { Request, Response } from "express";
export async function emergencyAlert(req: Request, res: Response) {
  try {
    const { patientId } = req.body;
    if (!patientId) {
      return res.status(400).json({ error: "patientId requis" });
    }

    const result = await triggerEmergency(patientId);
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error("Erreur urgence:", err.message);
    res.status(500).json({ error: err.message });
  }
}
