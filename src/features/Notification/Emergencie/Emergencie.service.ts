import { createEmergency } from "./Emergencie.repository";
import { findPsychologistTokens } from "../../Notification/Device/Device.repository";

async function sendExpoNotification(tokens: string[], title: string, body: string) {
  const messages = tokens.map((token) => ({
    to: token,
    sound: "default",
    title,
    body,
    data: { urgent: true },
  }));

  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
  });

  return response.json();
}

export async function triggerEmergency(patientId: string) {
  // 1️⃣ Enregistrer l'urgence
  const emergency = await createEmergency(patientId);

  // 2️⃣ Récupérer les tokens des psy
  const tokens = await findPsychologistTokens(10);
  if (tokens.length === 0) throw new Error("Aucun psychologue disponible");

  // 3️⃣ Envoyer la notification
  const notifResponse = await sendExpoNotification(
    tokens,
    "🚨 Alerte Urgence",
    `Un patient (${patientId}) a besoin d’aide immédiatement !`
  );

  return { emergency, notifResponse };
}
