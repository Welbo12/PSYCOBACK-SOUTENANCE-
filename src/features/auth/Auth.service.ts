

  

import { AuthRepository } from "./Auth.repository";
import { IUser, UserRole } from "./Auth.model";
import { comparePassword, hashPassword } from "../../shared/utils/hashUtils";
import { cryptEmail, compareEmail } from "../../shared/utils/cryptUtils";
import { sendOtpEmail } from "../../shared/utils/emailUtils";
import pool from "../../shared/database/client";

export class RegisterPatientService {
  // ----------------------------
  // 1 Enregistrement patient
  // ----------------------------
  static async registerPatient(
    pseudonyme: string,
    motDePasse: string,
    email: string,
    role: UserRole
  ) {
    try {
      if (!pseudonyme || !motDePasse || !email) {
        throw new Error("Champs obligatoires manquants");
      }

      // Crypter l'email et hasher le mot de passe
      const encryptedEmail = await cryptEmail(email);
      const hashedPassword = await hashPassword(motDePasse);

      // Créer un nouvel utilisateur patient
      const user = await AuthRepository.createPatient(
        pseudonyme,
        hashedPassword,
        encryptedEmail,
        role
      );
      return user;
    } catch (error: any) {
      // Gestion des erreurs de contrainte unique (Postgres)
      if (error.code === "23505") {
        if (error.constraint === "utilisateur_pseudonyme_key") {
          throw new Error(
            "Ce pseudonyme est déjà utilisé. Veuillez en choisir un autre."
          );
        } else if (error.constraint === "utilisateur_email_key") {
          throw new Error("Cette adresse email est déjà utilisée.");
        } else {
          throw new Error(
            "Cette information est déjà utilisée par un autre utilisateur."
          );
        }
      }
      throw error;
    }
  }

  // ----------------------------
  // 2️⃣ Login patient (email crypté)
  // ----------------------------
  static async login(email: string, motDePasse: string) {
    const users = await AuthRepository.findAllUsers();

    let user = null;
    for (const u of users) {
      if (!u.email) continue;

      const emailToCompare = Buffer.isBuffer(u.email)
        ? u.email.toString()
        : u.email;
      const isEmailValid = await compareEmail(email, emailToCompare);

      if (isEmailValid) {
        user = u;
        break;
      }
    }

    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    if (!user.motDePasse) {
      throw new Error("Compte utilisateur invalide - mot de passe manquant");
    }

    const isPasswordValid = await comparePassword(
      motDePasse,
      user.motDePasse
    );
    if (!isPasswordValid) {
      throw new Error("Mot de passe incorrect");
    }

    return user;
  }

  // ----------------------------
  // 3️⃣ Enregistrement psychologue
  // ----------------------------
  static async registerPsychologue(
    nom: string,
    prenom: string,
    motDePasse: string,
    email_clair: string,
    domaines: string[],
    sujets: string[],
    methodes: string[],
    description: string,
    motivation: string,
      cvUrl?: string,
    photoUrl?: string
  ): Promise<IUser> {
    if (!nom || !prenom || !motDePasse || !email_clair) {
      throw new Error("Champs obligatoires manquants");
    }

    // Vérif si mail déjà utilisé
    const existing = await AuthRepository.findByClearEmail(email_clair);
    if (existing) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    // Hash mot de passe
    const hashedPassword = await hashPassword(motDePasse);

    // Création en BDD ( pas de pseudonyme ici)
    const user = await AuthRepository.createPsychologue(
      nom,
      prenom,
      hashedPassword,
      email_clair,
      domaines,
      sujets,
      methodes,
      description,
      motivation,
      cvUrl,
      photoUrl
    );

    return user;
  }

  // ----------------------------
  // Login psychologue (email clair)
  // ----------------------------
  static async loginByClearEmail(email_clair: string, motDePasse: string) {
    const user = await AuthRepository.findByClearEmail(email_clair);
    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    const isPasswordValid = await comparePassword(
      motDePasse,
      user.motDePasse
    );
    if (!isPasswordValid) {
      throw new Error("Mot de passe incorrect");
    }
    
    // Bloquer la connexion si psychologue non approuvé
    if (user.role === "psychologue") {
      const r = await pool.query(
        "SELECT statutverification FROM psychologue WHERE id = $1",
        [user.id]
      );
      if (!r.rows[0]?.statutverification) {
        const err: any = new Error("Votre compte est en attente de validation.");
        err.code = "PENDING_APPROVAL";
        throw err;
      }
    }


    return user;
  }

  // ----------------------------
  //  Génération OTP
  // ----------------------------
  static generateOTP(length = 6) {
    let otp = "";
    for (let i = 0; i < length; i++) otp += Math.floor(Math.random() * 10);
    return otp;
  }

  // ----------------------------
  //  Envoi OTP (seulement psy/admin)
  // ----------------------------
  static async sendOTP(userId: string, type: "activation" | "reset") {
    // 1) Vérifier rôle + récupérer email clair AVANT de créer l'OTP
    const result = await pool.query(
      "SELECT role, email_clair FROM utilisateur WHERE id = $1",
      [userId]
    );
    const user = result.rows[0];

    if (!user) throw new Error("Utilisateur introuvable");

    if (user.role !== "psychologue" && user.role !== "admin") {
      throw new Error("OTP par email non disponible pour ce type d'utilisateur");
    }

    if (!user.email_clair) {
      throw new Error("Adresse email claire introuvable");
    }

    // 2) Générer et enregistrer l'OTP une seule fois avec le type demandé
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await AuthRepository.createOTP({ userId, otp, type, expiresAt });

    // 3) Envoyer l'email OTP
    await sendOtpEmail(user.email_clair, otp);

    return { message: `OTP ${type} envoyé` };
  }

  // ----------------------------
  // 7️⃣ Vérification OTP (sans action)
  // ----------------------------
  static async verifyOTP(
    userId: string,
    otp: string,
    type: "activation" | "reset"
  ) {
    const record = await AuthRepository.findValidOTP(userId, otp, type);
    if (!record) throw new Error("OTP invalide ou expiré");

    if (type === "activation") {
      // Marquer utilisateur comme vérifié
      await pool.query("UPDATE utilisateur SET verified = true WHERE id = $1", [
        userId,
      ]);
      // Marquer OTP comme utilisé
      await AuthRepository.markOTPUsed(record.id!);
    }
    // Pour le reset, on ne fait que vérifier l'OTP, on ne le marque pas comme utilisé encore

    return {
      message: type === "activation" ? "Compte vérifié" : "OTP validé, vous pouvez maintenant réinitialiser votre mot de passe",
    };
  }

  // ----------------------------
  // 8️⃣ Reset password après vérification OTP
  // ----------------------------
  static async resetPasswordAfterOTP(
    userId: string,
    otp: string,
    newPassword: string
  ) {
    // Vérifier que l'OTP est valide et non utilisé
    const record = await AuthRepository.findValidOTP(userId, otp, "reset");
    if (!record) throw new Error("OTP invalide ou expiré");

    // Hasher le nouveau mot de passe
    const hashedPassword = await hashPassword(newPassword);
    
    // Mettre à jour le mot de passe
    await pool.query(
      "UPDATE utilisateur SET motdepasse = $1 WHERE id = $2",
      [hashedPassword, userId]
    );

    // Marquer OTP comme utilisé
    await AuthRepository.markOTPUsed(record.id!);

    return {
      message: "Mot de passe réinitialisé avec succès",
    };
  }

  // Helpers to support email_clair controller
  static async sendOTPByEmailClair(email_clair: string, type: "activation" | "reset") {
    const user = await AuthRepository.findByClearEmail(email_clair);
    if (!user) throw new Error("Utilisateur introuvable");
    return this.sendOTP(user.id as string, type);
  }

  static async verifyOTPByEmailClair(
    email_clair: string,
    otp: string,
    type: "activation" | "reset"
  ) {
    const user = await AuthRepository.findByClearEmail(email_clair);
    if (!user) throw new Error("Utilisateur introuvable");
    return this.verifyOTP(user.id as string, otp, type);
  }

  static async resetPasswordByEmailClair(
    email_clair: string,
    otp: string,
    newPassword: string
  ) {
    const user = await AuthRepository.findByClearEmail(email_clair);
    if (!user) throw new Error("Utilisateur introuvable");
    return this.resetPasswordAfterOTP(user.id as string, otp, newPassword);
  }
 // ----------------------------
  // 🔐 Changer mot de passe (authentifié)
  // ----------------------------
  static async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    if (!userId || !oldPassword || !newPassword) {
      throw new Error("Champs obligatoires manquants");
    }

    // Récupérer l'utilisateur
    const result = await pool.query(
      `SELECT id, motdepasse as "motDePasse" FROM utilisateur WHERE id = $1`,
      [userId]
    );
    const user = result.rows[0];
    if (!user || !user.motDePasse) {
      throw new Error("Utilisateur introuvable");
    }

    // Vérifier l'ancien mot de passe
    const ok = await comparePassword(oldPassword, user.motDePasse);
    if (!ok) {
      throw new Error("Ancien mot de passe incorrect");
    }

    // Hasher le nouveau et mettre à jour
    const hashed = await hashPassword(newPassword);
    await pool.query(
      `UPDATE utilisateur SET motdepasse = $1 WHERE id = $2`,
      [hashed, userId]
    );

    return { message: "Mot de passe modifié avec succès" };
  }

   // Statistiques: nombre de patients
  static async countPatients(): Promise<number> {
    return AuthRepository.countPatients();
  }
    // Statistiques: nombre de psychologues
  static async countPsychologues(): Promise<number> {
    return AuthRepository.countPsychologues();
  }
  // ----------------------------
  // 9️⃣ Lister candidatures psychologues
  // ----------------------------
  static async listPsychologistApplications() {
    return AuthRepository.listPsychologistApplications();
  }

  // ----------------------------
  // 🔟 Approuver un psychologue
  // ----------------------------
  static async approvePsychologist(userId: string) {
    if (!userId) throw new Error("Identifiant utilisateur manquant");
    await AuthRepository.approvePsychologist(userId);
    return { message: "Psychologue approuvé" };
  }
}
