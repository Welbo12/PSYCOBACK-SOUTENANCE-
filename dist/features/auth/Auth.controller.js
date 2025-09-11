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
exports.RegisterPatientController = void 0;
const Auth_service_1 = require("./Auth.service");
const jswtUtils_1 = require("../../shared/utils/jswtUtils");
class RegisterPatientController {
    static registerPatient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { pseudonyme, motDePasse, email, role } = req.body;
                // Appel au service pour enregistrer un utilisateur
                const user = yield Auth_service_1.RegisterPatientService.registerPatient(pseudonyme, motDePasse, email, role);
                res.status(201).json({
                    message: "Patient enregistré avec succès",
                    data: user,
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: "Erreur interne du serveur" });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, motDePasse } = req.body;
                // Appel au service pour connecter un utilisateur
                const user = yield Auth_service_1.RegisterPatientService.login(email, motDePasse);
                // Génération du token JWT
                const token = (0, jswtUtils_1.generateToken)({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                });
                res.status(200).json({
                    success: true,
                    token,
                    user,
                });
            }
            catch (err) {
                console.error(err);
                // Gestion des erreurs spécifiques
                if (err.message === "Utilisateur introuvable" || err.message === "Mot de passe incorrect") {
                    return res.status(401).json({ error: err.message });
                }
                res.status(500).json({ error: "Erreur interne du serveur" });
            }
        });
    }
    static loginByClearEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, motDePasse } = req.body;
                // Appel au service pour connecter un utilisateur avec un email en clair
                const user = yield Auth_service_1.RegisterPatientService.loginByClearEmail(email, motDePasse);
                // Génération du token JWT
                const token = (0, jswtUtils_1.generateToken)({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                });
                res.status(200).json({
                    success: true,
                    token,
                    user,
                });
            }
            catch (err) {
                console.error(err);
                // Gestion des erreurs spécifiques
                if (err.message === "Utilisateur introuvable" || err.message === "Mot de passe incorrect") {
                    return res.status(401).json({ error: err.message });
                }
                res.status(500).json({ error: "Erreur interne du serveur" });
            }
        });
    }
}
exports.RegisterPatientController = RegisterPatientController;
