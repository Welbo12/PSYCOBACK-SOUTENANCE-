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
exports.ensureAdmin = ensureAdmin;
const createAdmin_1 = require("./createAdmin");
function ensureAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        const email = process.env.ADMIN_EMAIL || 'admin@monapp.com';
        const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
        const pseudonyme = process.env.ADMIN_PSEUDONYME || 'admin';
        try {
            const admin = yield (0, createAdmin_1.createAdmin)(email, password, pseudonyme);
            if (admin.alreadyExisted) {
                console.log(` Admin déjà existant : ${admin.email_clair}`);
            }
            else {
                console.log(`Nouvel admin créé : ${admin.email_clair}`);
            }
        }
        catch (e) {
            console.error('Erreur création admin au démarrage:', e);
        }
    });
}
