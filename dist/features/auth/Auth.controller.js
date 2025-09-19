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
const Auth_repository_1 = require("./Auth.repository");
const jswtUtils_1 = require("../../shared/utils/jswtUtils");
class RegisterPatientController {
    // ----------------------------
    // 1️⃣ Patient register
    // ----------------------------
    static registerPatient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { pseudonyme, motDePasse, email, role } = req.body;
                if (!pseudonyme || !motDePasse || !email || !role) {
                    return res.status(400).json({ error: "Champs obligatoires manquants" });
                }
                const user = yield Auth_service_1.RegisterPatientService.registerPatient(pseudonyme, motDePasse, email, role);
                res.status(201).json({
                    message: "Patient enregistré avec succès",
                    data: user,
                });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    // ----------------------------
    // 2️⃣ Patient login
    // ----------------------------
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, motDePasse } = req.body;
                if (!email || !motDePasse) {
                    return res.status(400).json({ error: "Champs obligatoires manquants" });
                }
                const user = yield Auth_service_1.RegisterPatientService.login(email, motDePasse);
                const token = (0, jswtUtils_1.generateToken)({ id: user.id, role: user.role });
                res.status(200).json({ success: true, token, user });
            }
            catch (err) {
                if (err.message === "Utilisateur introuvable" ||
                    err.message === "Mot de passe incorrect" ||
                    err.message === "Compte utilisateur invalide - mot de passe manquant") {
                    return res.status(401).json({ error: err.message });
                }
                res.status(500).json({ error: "Erreur interne du serveur" });
            }
        });
    }
    // ----------------------------
    // 3️⃣ Psychologue register
    // ----------------------------
    static registerPsychologue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nom, prenom, motDePasse, email_clair, domaines, sujets, methodes, description, motivation, cvUrl } = req.body;
                if (!nom || !prenom || !motDePasse || !email_clair) {
                    return res.status(400).json({ error: "Champs obligatoires manquants" });
                }
                const user = yield Auth_service_1.RegisterPatientService.registerPsychologue(nom, prenom, motDePasse, email_clair, domaines || [], sujets || [], methodes || [], description || "", motivation || "", cvUrl);
                res.status(201).json({ message: "Psychologue enregistré avec succès", data: user });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    // ----------------------------
    // 4️⃣ Psychologue login (email clair)
    // ----------------------------
    static loginByClearEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email_clair, motDePasse } = req.body;
                if (!email_clair || !motDePasse) {
                    return res.status(400).json({ error: "Champs obligatoires manquants" });
                }
                const user = yield Auth_service_1.RegisterPatientService.loginByClearEmail(email_clair, motDePasse);
                const token = (0, jswtUtils_1.generateToken)({ id: user.id, role: user.role });
                res.status(200).json({ success: true, token, user });
            }
            catch (err) {
                if (err.message === "Utilisateur introuvable" || err.message === "Mot de passe incorrect") {
                    return res.status(401).json({ error: err.message });
                }
                res.status(500).json({ error: "Erreur interne du serveur" });
            }
        });
    }
    // static async requestOTP(req: Request, res: Response) {
    //   try {
    //     const { email, type } = req.body;
    //     if (!email || !type) {
    //       return res.status(400).json({ error: "Champs obligatoires manquants (email, type)" });
    //     }
    //     if (type !== "activation" && type !== "reset") {
    //       return res.status(400).json({ error: "Type OTP invalide" });
    //     }
    //     // Résoudre userId via email clair
    //     const u = await AuthRepository.findByClearEmail(email);
    //     if (!u) return res.status(404).json({ error: "Utilisateur introuvable" });
    //     const targetUserId = u.id as string;
    //     const result = await RegisterPatientService.sendOTP(targetUserId, type);
    //     res.status(200).json(result);
    //   } catch (err: any) {
    //     console.error(err);
    //     res.status(500).json({ error: "Erreur interne du serveur" });
    //   }
    // }
    // static async requestOTP(req: Request, res: Response) {
    //   try {
    //     const { email_clair, type } = req.body;
    //     if (!email_clair || !type) {
    //       return res.status(400).json({ error: "Champs obligatoires manquants (email_clair, type)" });
    //     }
    //     if (type !== "activation" && type !== "reset") {
    //       return res.status(400).json({ error: "Type OTP invalide" });
    //     }
    //     const u = await AuthRepository.findByClearEmail(email_clair);
    //     if (!u) return res.status(404).json({ error: "Utilisateur introuvable" });
    //     const targetUserId = u.id as string;
    //     const result = await RegisterPatientService.sendOTP(targetUserId, type);
    //     res.status(200).json(result);
    //   } catch (err: any) {
    //     console.error(err);
    //     res.status(500).json({ error: "Erreur interne du serveur" });
    //   }
    // }
    //   // ----------------------------
    //   // Vérification OTP
    //   // ----------------------------
    //   // static async verifyOTP(req: Request, res: Response) {
    //   //   try {
    //   //     const { email, otp, type } = req.body;
    //   //     if (!email || !otp || !type) {
    //   //       return res.status(400).json({ error: "Champs obligatoires manquants (email, otp, type)" });
    //   //     }
    //   //     if (type !== "activation" && type !== "reset") {
    //   //       return res.status(400).json({ error: "Type OTP invalide" });
    //   //     }
    //   //     // Résoudre userId via email clair
    //   //     const u = await AuthRepository.findByClearEmail(email);
    //   //     if (!u) return res.status(404).json({ error: "Utilisateur introuvable" });
    //   //     const userId = u.id as string;
    //   //     const result = await RegisterPatientService.verifyOTP(userId, otp, type);
    //   //     res.status(200).json(result);
    //   //   } catch (err: any) {
    //   //     console.error(err);
    //   //     // Cas OTP invalide ou expiré
    //   //     if (err.message.includes("OTP invalide") || err.message.includes("Nouveau mot de passe requis")) {
    //   //       return res.status(400).json({ error: err.message });
    //   //     }
    //   //     res.status(500).json({ error: "Erreur interne du serveur" });
    //   //   }
    //   // }
    //   static async verifyOTP(req: Request, res: Response) {
    //   try {
    //     const { email_clair, otp, type } = req.body;
    //     if (!email_clair || !otp || !type) {
    //       return res.status(400).json({ error: "Champs obligatoires manquants (email_clair, otp, type)" });
    //     }
    //     if (type !== "activation" && type !== "reset") {
    //       return res.status(400).json({ error: "Type OTP invalide" });
    //     }
    //     const u = await AuthRepository.findByClearEmail(email_clair);
    //     if (!u) return res.status(404).json({ error: "Utilisateur introuvable" });
    //     const userId = u.id as string;
    //     const result = await RegisterPatientService.verifyOTP(userId, otp, type);
    //     res.status(200).json(result);
    //   } catch (err: any) {
    //     console.error(err);
    //     if (err.message.includes("OTP invalide") || err.message.includes("Nouveau mot de passe requis")) {
    //       return res.status(400).json({ error: err.message });
    //     }
    //     res.status(500).json({ error: "Erreur interne du serveur" });
    //   }
    // }
    static requestOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email_clair, type } = req.body;
                if (!email_clair || !type) {
                    return res.status(400).json({ error: "Champs obligatoires manquants (email_clair, type)" });
                }
                if (type !== "activation" && type !== "reset") {
                    return res.status(400).json({ error: "Type OTP invalide" });
                }
                const u = yield Auth_repository_1.AuthRepository.findByClearEmail(email_clair);
                if (!u)
                    return res.status(404).json({ error: "Utilisateur introuvable" });
                const targetUserId = u.id;
                const result = yield Auth_service_1.RegisterPatientService.sendOTP(targetUserId, type);
                res.status(200).json(result);
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: "Erreur interne du serveur" });
            }
        });
    }
    //   static async verifyOTP(req: Request, res: Response) {
    //   try {
    //     const { email_clair, otp, type } = req.body;
    //     if (!email_clair || !otp || !type) {
    //       return res.status(400).json({ error: "Champs obligatoires manquants (email_clair, otp, type)" });
    //     }
    //     if (type !== "activation" && type !== "reset") {
    //       return res.status(400).json({ error: "Type OTP invalide" });
    //     }
    //     const u = await AuthRepository.findByClearEmail(email_clair);
    //     if (!u) return res.status(404).json({ error: "Utilisateur introuvable" });
    //     const userId = u.id as string;
    //     const result = await RegisterPatientService.verifyOTP(userId, otp, type);
    //     res.status(200).json(result);
    //   } catch (err: any) {
    //     console.error(err);
    //     if (err.message.includes("OTP invalide") || err.message.includes("Nouveau mot de passe requis")) {
    //       return res.status(400).json({ error: err.message });
    //     }
    //     res.status(500).json({ error: "Erreur interne du serveur" });
    //   }
    // }
    static verifyOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email_clair, otp, type } = req.body;
                if (!email_clair || !otp || !type) {
                    return res.status(400).json({ error: "Champs obligatoires manquants (email_clair, otp, type)" });
                }
                if (type !== "activation" && type !== "reset") {
                    return res.status(400).json({ error: "Type OTP invalide" });
                }
                // Utiliser le helper du service qui gère email_clair
                const result = yield Auth_service_1.RegisterPatientService.verifyOTPByEmailClair(email_clair, otp, type);
                res.status(200).json(result);
            }
            catch (err) {
                console.error(err);
                if (err.message.includes("OTP invalide")) {
                    return res.status(400).json({ error: err.message });
                }
                res.status(500).json({ error: "Erreur interne du serveur" });
            }
        });
    }
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email_clair, otp, newPassword } = req.body;
                if (!email_clair || !otp || !newPassword) {
                    return res.status(400).json({ error: "Champs obligatoires manquants (email_clair, otp, newPassword)" });
                }
                // Utiliser le helper du service pour reset password
                const result = yield Auth_service_1.RegisterPatientService.resetPasswordByEmailClair(email_clair, otp, newPassword);
                res.status(200).json(result);
            }
            catch (err) {
                console.error(err);
                if (err.message.includes("OTP invalide")) {
                    return res.status(400).json({ error: err.message });
                }
                res.status(500).json({ error: "Erreur interne du serveur" });
            }
        });
    }
}
exports.RegisterPatientController = RegisterPatientController;
