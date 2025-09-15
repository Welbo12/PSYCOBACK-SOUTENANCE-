import { RegisterPatientService } from "./Auth.service";
import { Request, Response } from "express";
import { IUser } from "./Auth.model";
import { generateToken } from "../../shared/utils/jswtUtils";

export class RegisterPatientController {
    static async registerPatient(req: Request, res: Response) {
        try {
            const { pseudonyme, motDePasse, email, role } = req.body;

            // Appel au service pour enregistrer un utilisateur
            const user = await RegisterPatientService.registerPatient(pseudonyme, motDePasse, email, role);

            res.status(201).json({
                message: "Patient enregistré avec succès",
                data: user,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, motDePasse } = req.body;

            // Appel au service pour connecter un utilisateur
            const user = await RegisterPatientService.login(email, motDePasse);

            // Génération du token JWT
            const token = generateToken({
                id: user.id,
                email: user.email,
                role: user.role,
            });

            res.status(200).json({
                success: true,
                token,
                user,
            });
        } catch (err: any) {
            console.error(err);

            // Gestion des erreurs spécifiques
            if (err.message === "Utilisateur introuvable" || 
                err.message === "Mot de passe incorrect" ||
                err.message === "Compte utilisateur invalide - mot de passe manquant") {
                return res.status(401).json({ error: err.message });
            }

            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    static async loginByClearEmail(req: Request, res: Response) {
        try {
            const { email, motDePasse } = req.body;

            // Appel au service pour connecter un utilisateur avec un email en clair
            const user = await RegisterPatientService.loginByClearEmail(email, motDePasse);

            // Génération du token JWT
            const token = generateToken({
                id: user.id,
                email: user.email,
                role: user.role,
            });

            res.status(200).json({
                success: true,
                token,
                user,
            });
        } catch (err: any) {
            console.error(err);

            // Gestion des erreurs spécifiques
            if (err.message === "Utilisateur introuvable" || 
                err.message === "Mot de passe incorrect" ||
                err.message === "Compte utilisateur invalide - mot de passe manquant") {
                return res.status(401).json({ error: err.message });
            }

            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }
}