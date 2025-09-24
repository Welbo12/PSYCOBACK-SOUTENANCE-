import { saveDeviceToken } from "./Device.repository";;

import { Request, Response } from "express";


export async function registerDevice(req: Request, res: Response) {
  const { userId, deviceToken } = req.body;
  if (!userId || !deviceToken) {
    return res.status(400).json({ error: "userId et deviceToken requis" });
  }

  try {
    await saveDeviceToken(userId, deviceToken);
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur enregistrement token:", err);
    res.status(500).json({ error: "Impossible d'enregistrer le token" });
  }
}

