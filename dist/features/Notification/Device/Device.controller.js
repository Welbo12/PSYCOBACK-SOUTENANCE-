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
exports.registerDevice = registerDevice;
const Device_repository_1 = require("./Device.repository");
;
function registerDevice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, deviceToken } = req.body;
        if (!userId || !deviceToken) {
            return res.status(400).json({ error: "userId et deviceToken requis" });
        }
        try {
            yield (0, Device_repository_1.saveDeviceToken)(userId, deviceToken);
            res.json({ success: true });
        }
        catch (err) {
            console.error("Erreur enregistrement token:", err);
            res.status(500).json({ error: "Impossible d'enregistrer le token" });
        }
    });
}
