import { AuthRepository } from "./Auth.repository";
import { IUser } from "./Auth.model";
import { comparePassword, hashPassword } from "../../shared/utils/hashUtils";
import { cryptEmail, compareEmail } from "../../shared/utils/cryptUtils";

export class RegisterPatientService {
    static async registerPatient(pseudonyme: string, motDePasse: string, email: string, role: string) {
    // Hasher l'email de façon déterministe et hasher le mot de passe
    const hashedEmail = AuthRepository.hashEmail(email);
    const hashedPassword = await hashPassword(motDePasse);

    // Créer un nouvel utilisateur
    const user = await AuthRepository.createPatient(pseudonyme, hashedPassword, hashedEmail, role);
    return user;
    }

    static async login(email: string, motDePasse: string) {
        // Hasher l'email fourni par l'utilisateur
        const hashedEmail = AuthRepository.hashEmail(email);

        // Rechercher l'utilisateur dans la base de données avec l'email hashé
        const user = await AuthRepository.findByMail(hashedEmail);
        if (!user) {
            throw new Error("Utilisateur introuvable");
        }

        // Vérifier le mot de passe
        const isPasswordValid = await comparePassword(motDePasse, user.motDePasse);
        if (!isPasswordValid) {
            throw new Error("Mot de passe incorrect");
        }

        return user;
    }

    static async loginByClearEmail(email: string, motDePasse: string) {
        // Rechercher l'utilisateur dans la base de données avec l'email en clair
        const user = await AuthRepository.findByClearEmail(email);
        if (!user) {
            throw new Error("Utilisateur introuvable");
        }

        // Vérifier le mot de passe
        const isPasswordValid = await comparePassword(motDePasse, user.motDePasse);
        if (!isPasswordValid) {
            throw new Error("Mot de passe incorrect");
        }

        return user;
    }
}