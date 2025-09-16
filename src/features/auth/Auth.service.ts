


// import { AuthRepository } from "./Auth.repository";
// import { IUser } from "./Auth.model";
// import { comparePassword, hashPassword } from "../../shared/utils/hashUtils";
// import { cryptEmail, compareEmail } from "../../shared/utils/cryptUtils";
// import pool from "../../shared/database/client";
// import { sendEmail } from "../../shared/utils/emailUtils"
// export class RegisterPatientService {
//     // ----------------------------
//     // 1️⃣ Enregistrement patient
//     // ----------------------------
//     static async registerPatient(pseudonyme: string, motDePasse: string, email: string, role: string) {
//         try {
//             if (!pseudonyme || !motDePasse || !email) {
//                 throw new Error("Champs obligatoires manquants");
//             }

//             // Crypter l'email et hasher le mot de passe
//             const encryptedEmail = await cryptEmail(email);
//             const hashedPassword = await hashPassword(motDePasse);

//             // Créer un nouvel utilisateur patient
//             const user = await AuthRepository.createPatient(pseudonyme, hashedPassword, encryptedEmail, role);
//             return user;
//         } catch (error: any) {
//             // Gestion des erreurs de contrainte unique (Postgres)
//             if (error.code === '23505') {
//                 if (error.constraint === 'utilisateur_pseudonyme_key') {
//                     throw new Error("Ce pseudonyme est déjà utilisé. Veuillez en choisir un autre.");
//                 } else if (error.constraint === 'utilisateur_email_key') {
//                     throw new Error("Cette adresse email est déjà utilisée.");
//                 } else {
//                     throw new Error("Cette information est déjà utilisée par un autre utilisateur.");
//                 }
//             }
//             throw error;
//         }
//     }

//     // ----------------------------
//     // 2️⃣ Login patient (email crypté)
//     // ----------------------------
//     static async login(email: string, motDePasse: string) {
//         const users = await AuthRepository.findAllUsers();

//         let user = null;
//         for (const u of users) {
//             if (!u.email) continue;

//             const emailToCompare = Buffer.isBuffer(u.email) ? u.email.toString() : u.email;
//             const isEmailValid = await compareEmail(email, emailToCompare);

//             if (isEmailValid) {
//                 user = u;
//                 break;
//             }
//         }

//         if (!user) {
//             throw new Error("Utilisateur introuvable");
//         }

//         if (!user.motDePasse) {
//             throw new Error("Compte utilisateur invalide - mot de passe manquant");
//         }

//         const isPasswordValid = await comparePassword(motDePasse, user.motDePasse);
//         if (!isPasswordValid) {
//             throw new Error("Mot de passe incorrect");
//         }

//         return user;
//     }

//     // ----------------------------
//     // 3️⃣ Enregistrement psychologue (email clair + pas de pseudonyme obligatoire)
//     // ----------------------------
//     static async registerPsychologue(
//         nom: string,
//         prenom: string,
//         motDePasse: string,
//         email_clair: string,
//         domaines: string[],
//         sujets: string[],
//         methodes: string[],
//         description: string,
//         motivation: string,
//         cvUrl?: string
//     ): Promise<IUser> {
//         if (!nom || !prenom || !motDePasse || !email_clair) {
//             throw new Error("Champs obligatoires manquants");
//         }

//         // Vérif si mail déjà utilisé
//         const existing = await AuthRepository.findByClearEmail(email_clair);
//         if (existing) {
//             throw new Error("Un utilisateur avec cet email existe déjà");
//         }

//         // Hash mot de passe
//         const hashedPassword = await hashPassword(motDePasse);

//         // Création en BDD (⚠️ pas de pseudonyme ici)
//         const user = await AuthRepository.createPsychologue(
//             nom,
//             prenom,
//             hashedPassword,
//             email_clair,
//             domaines,
//             sujets,
//             methodes,
//             description,
//             motivation,
//             cvUrl
//         );

//         return user;
//     }

//     // ----------------------------
//     // 4️⃣ Login psychologue (email clair)
//     // ----------------------------
//     static async loginByClearEmail(email_clair: string, motDePasse: string) {
//         const user = await AuthRepository.findByClearEmail(email_clair);
//         if (!user) {
//             throw new Error("Utilisateur introuvable");
//         }

//         const isPasswordValid = await comparePassword(motDePasse, user.motDePasse);
//         if (!isPasswordValid) {
//             throw new Error("Mot de passe incorrect");
//         }

//         return user;
//     }

//     static generateOTP(length = 6) {
//     let otp = "";
//     for (let i = 0; i < length; i++) otp += Math.floor(Math.random() * 10);
//     return otp;
//   }

//   // ----------------------------
//   // Envoi OTP (activation ou reset)
//   // ----------------------------
//   static async sendOTP(userId: string, type: "activation" | "reset") {
//     const otp = this.generateOTP();
//     const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
//     await AuthRepository.createOTP({ userId, otp, type, expiresAt });
//     // TODO: envoyer l'OTP par email
//     console.log(`OTP ${type} pour l'utilisateur ${userId}: ${otp}`);
//     return { message: `OTP ${type} envoyé` };
//   }

//   // ----------------------------
//   // Vérification OTP et action
//   // ----------------------------
//   static async verifyOTP(userId: string, otp: string, type: "activation" | "reset", newPassword?: string) {
//     const record = await AuthRepository.findValidOTP(userId, otp, type);
//     if (!record) throw new Error("OTP invalide ou expiré");

//     if (type === "activation") {
//       // Marquer utilisateur comme vérifié
//       await pool.query("UPDATE utilisateur SET verified = true WHERE id = $1", [userId]);
//     } else if (type === "reset") {
//       if (!newPassword) throw new Error("Nouveau mot de passe requis");
//       const hashedPassword = await hashPassword(newPassword);
//       await pool.query("UPDATE utilisateur SET motdepasse = $1 WHERE id = $2", [hashedPassword, userId]);
//     }

//     // Marquer OTP comme utilisé
//     await AuthRepository.markOTPUsed(record.id!);

//     return { message: type === "activation" ? "Compte vérifié" : "Mot de passe réinitialisé" };
//   }


// static async sendOTP(userId: string, type: "activation" | "reset") {
//   const otp = this.generateOTP();
//   const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // expire dans 10 min

//   // Sauvegarde OTP en base
//   const record = await AuthRepository.createOTP({ userId, otp, type, expiresAt });

//   // Récupérer l'email clair si dispo
//   const result = await pool.query("SELECT email_clair, email FROM utilisateur WHERE id = $1", [userId]);
//   const user = result.rows[0];

//   if (!user) throw new Error("Utilisateur introuvable");

//   let destinataire: string | null = null;

//   if (user.email_clair) {
//     destinataire = user.email_clair; // cas psychologue/admin
//   } else if (user.email) {
//     // cas patient : impossible de décrypter directement si tu utilises cryptEmail()
//     // soit tu conserves aussi un champ email_clair pour OTP, soit tu ajoutes une logique spéciale
//     throw new Error("Impossible d’envoyer OTP : email crypté");
//   }

//   if (!destinataire) {
//     throw new Error("Aucune adresse email disponible pour l'utilisateur");
//   }

//   // Envoi réel de l'email
//   await sendEmail(
//     destinataire,
//     type === "activation" ? "Activation de votre compte" : "Réinitialisation du mot de passe",
//     `Votre code OTP est : ${otp}. Il expire dans 10 minutes.`,
//     `<p>Votre code OTP est : <b>${otp}</b></p><p>Il expire dans 10 minutes.</p>`
//   );

//   return { message: `OTP ${type} envoyé à ${destinataire}` };
// }


  
// }
import { AuthRepository } from "./Auth.repository";
import { IUser, UserRole } from "./Auth.model";
import { comparePassword, hashPassword } from "../../shared/utils/hashUtils";
import { cryptEmail, compareEmail } from "../../shared/utils/cryptUtils";
import { sendOtpEmail } from "../../shared/utils/emailUtils";
import pool from "../../shared/database/client";

export class RegisterPatientService {
  // ----------------------------
  // 1️⃣ Enregistrement patient
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
    cvUrl?: string
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

    // Création en BDD (⚠️ pas de pseudonyme ici)
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
      cvUrl
    );

    return user;
  }

  // ----------------------------
  // 4️⃣ Login psychologue (email clair)
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

    return user;
  }

  // ----------------------------
  // 5️⃣ Génération OTP
  // ----------------------------
  static generateOTP(length = 6) {
    let otp = "";
    for (let i = 0; i < length; i++) otp += Math.floor(Math.random() * 10);
    return otp;
  }

  // ----------------------------
  // 6️⃣ Envoi OTP (seulement psy/admin)
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
  // 7️⃣ Vérification OTP et action
  // ----------------------------
  static async verifyOTP(
    userId: string,
    otp: string,
    type: "activation" | "reset",
    newPassword?: string
  ) {
    const record = await AuthRepository.findValidOTP(userId, otp, type);
    if (!record) throw new Error("OTP invalide ou expiré");

    if (type === "activation") {
      // Marquer utilisateur comme vérifié
      await pool.query("UPDATE utilisateur SET verified = true WHERE id = $1", [
        userId,
      ]);
    } else if (type === "reset") {
      if (!newPassword) throw new Error("Nouveau mot de passe requis");
      const hashedPassword = await hashPassword(newPassword);
      await pool.query(
        "UPDATE utilisateur SET motdepasse = $1 WHERE id = $2",
        [hashedPassword, userId]
      );
    }

    // Marquer OTP comme utilisé
    await AuthRepository.markOTPUsed(record.id!);

    return {
      message:
        type === "activation" ? "Compte vérifié" : "Mot de passe réinitialisé",
    };
  }
}
