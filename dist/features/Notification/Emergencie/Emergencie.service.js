"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerEmergency = triggerEmergency;
const Emergencie_repository_1 = require("./Emergencie.repository");
const Device_repository_1 = require("../../Notification/Device/Device.repository");
function sendExpoNotification(tokens, title, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const messages = tokens.map((token) => ({
            to: token,
            sound: "default",
            title,
            body,
            data: { urgent: true },
        }));
        const response = yield fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messages),
        });
        return response.json();
    });
}
function triggerEmergency(patientId) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1️⃣ Enregistrer l'urgence
        const emergency = yield (0, Emergencie_repository_1.createEmergency)(patientId);
        // 2️⃣ Récupérer les tokens des psy
        const tokens = yield (0, Device_repository_1.findPsychologistTokens)(10);
        if (tokens.length === 0)
            throw new Error("Aucun psychologue disponible");
        // 3️⃣ Envoyer la notification
        const notifResponse = yield sendExpoNotification(tokens, "🚨 Alerte Urgence", `Un patient (${patientId}) a besoin d’aide immédiatement !`);
        return { emergency, notifResponse };
    });
}
