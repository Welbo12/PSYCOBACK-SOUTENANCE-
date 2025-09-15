// import { AuthRepository } from "./Auth.repository";
// import { IUser } from "./Auth.model";
// import { comparePassword, hashPassword } from "../../shared/utils/hashUtils";
// import { cryptEmail, compareEmail } from "../../shared/utils/cryptUtils";

// export class RegisterPatientService {
//     static async registerPatient(pseudonyme: string, motDePasse: string, email: string, role: string) {
//         try {
//             // Crypter l'email et hasher le mot de passe
//             const encryptedEmail = await cryptEmail(email);
//             const hashedPassword = await hashPassword(motDePasse);

//             // Créer un nouvel utilisateur
//             const user = await AuthRepository.createPatient(pseudonyme, hashedPassword, encryptedEmail, role);
//             return user;
//         } catch (error: any) {
//             // Gestion des erreurs de contrainte unique
//             if (error.code === '23505') {
//                 if (error.constraint === 'utilisateur_pseudonyme_key') {
//                     throw new Error("Ce pseudonyme est déjà utilisé. Veuillez en choisir un autre.");
//                 } else if (error.constraint === 'utilisateur_email_key') {
//                     throw new Error("Cette adresse email est déjà utilisée.");
//                 } else {
//                     throw new Error("Cette information est déjà utilisée par un autre utilisateur.");
//                 }
//             }
//             // Relancer les autres erreurs
//             throw error;
//         }
//     }

//     static async login(email: string, motDePasse: string) {
//         try {
//             console.log("🔍 Tentative de connexion pour l'email:", email);
            
//             // Récupérer tous les utilisateurs pour comparer les emails cryptés
//             const users = await AuthRepository.findAllUsers();
//             console.log("📊 Nombre d'utilisateurs trouvés:", users.length);
            
//             let user = null;
//             // Chercher l'utilisateur en comparant l'email crypté
//             for (const u of users) {
//                 try {
//                     console.log(`🔍 Vérification utilisateur ${u.pseudonyme}:`, {
//                         id: u.id,
//                         email: u.email ? (u.email.includes(':') ? 'AES format' : 'bcrypt format') : 'NULL',
//                         emailLength: u.email ? u.email.length : 0
//                     });
                    
//                     if (!u.email) {
//                         console.log(`⏭️  Utilisateur ${u.pseudonyme} n'a pas d'email, ignoré`);
//                         continue;
//                     }
                    
//                     // Convertir le Buffer en chaîne si nécessaire
//                     const emailToCompare = Buffer.isBuffer(u.email) ? u.email.toString() : u.email;
//                     const isEmailValid = await compareEmail(email, emailToCompare);
//                     if (isEmailValid) {
//                         user = u;
//                         console.log("✅ Utilisateur trouvé:", u.pseudonyme);
//                         break;
//                     }
//                 } catch (emailError) {
//                     console.error("❌ Erreur lors de la comparaison d'email:", emailError);
//                     console.error("❌ Détails utilisateur:", { id: u.id, pseudonyme: u.pseudonyme, email: u.email });
//                     // Continue avec le prochain utilisateur
//                 }
//             }

//             if (!user) {
//                 console.log("❌ Aucun utilisateur trouvé pour cet email");
//                 throw new Error("Utilisateur introuvable");
//             }

//             // Vérifier le mot de passe
//             console.log("🔐 Vérification du mot de passe...");
            
//             // Vérifier que le mot de passe existe et est valide
//             console.log("🔍 Debug mot de passe:", {
//                 motDePasse: user.motDePasse,
//                 type: typeof user.motDePasse,
//                 length: user.motDePasse ? user.motDePasse.length : 'undefined',
//                 isNull: user.motDePasse === null,
//                 isUndefined: user.motDePasse === undefined,
//                 isEmpty: user.motDePasse === '',
//                 isStringNull: user.motDePasse === 'null',
//                 isStringUndefined: user.motDePasse === 'undefined'
//             });
            
//             if (!user.motDePasse || 
//                 user.motDePasse.trim() === '' || 
//                 user.motDePasse === 'null' || 
//                 user.motDePasse === 'undefined') {
//                 console.log("❌ L'utilisateur n'a pas de mot de passe valide enregistré");
//                 console.log(`🔍 Détails utilisateur: ${user.pseudonyme} - Mot de passe: "${user.motDePasse}"`);
//                 throw new Error("Compte utilisateur invalide - mot de passe manquant");
//             }
            
//             console.log("🔍 Mot de passe de l'utilisateur:", user.motDePasse ? "présent" : "absent");
//             const isPasswordValid = await comparePassword(motDePasse, user.motDePasse);
            
//             if (!isPasswordValid) {
//                 console.log("❌ Mot de passe incorrect");
//                 throw new Error("Mot de passe incorrect");
//             }

//             console.log("✅ Connexion réussie pour:", user.pseudonyme);
//             return user;
//         } catch (error) {
//             console.error("❌ Erreur dans login:", error);
//             throw error;
//         }
//     }

//     static async registerPsychologue(
//   nom: string,
//   prenom: string,
//   motDePasse: string,
//   email_clair: string,
//   domaines: string[],
//   sujets: string[],
//   methodes: string[],
//   description: string,
//   motivation: string,
//   cvUrl?: string
// ): Promise<IUser> {
//   // Vérif si mail déjà utilisé (dans email_clair car c’est un psy)
//   const existing = await AuthRepository.findByClearEmail(email_clair);
//   if (existing) {
//     throw new Error("Un utilisateur avec cet email existe déjà");
//   }

//   // Hash mot de passe
//   const hashedPassword = await hashPassword(motDePasse);

//   // Création en BDD
//   const user = await AuthRepository.createPsychologue(
//     nom,
//     prenom,
//     hashedPassword,
//     email_clair,
//     domaines,
//     sujets,
//     methodes,
//     description,
//     motivation,
//     cvUrl
//   );

//   return user;
// }

//  static async loginByClearEmail(email_clair: string, motDePasse: string) {
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



// }
import { AuthRepository } from "./Auth.repository";
import { IUser } from "./Auth.model";
import { comparePassword, hashPassword } from "../../shared/utils/hashUtils";
import { cryptEmail, compareEmail } from "../../shared/utils/cryptUtils";

export class RegisterPatientService {
    // ----------------------------
    // 1️⃣ Enregistrement patient
    // ----------------------------
    static async registerPatient(pseudonyme: string, motDePasse: string, email: string, role: string) {
        try {
            if (!pseudonyme || !motDePasse || !email) {
                throw new Error("Champs obligatoires manquants");
            }

            // Crypter l'email et hasher le mot de passe
            const encryptedEmail = await cryptEmail(email);
            const hashedPassword = await hashPassword(motDePasse);

            // Créer un nouvel utilisateur patient
            const user = await AuthRepository.createPatient(pseudonyme, hashedPassword, encryptedEmail, role);
            return user;
        } catch (error: any) {
            // Gestion des erreurs de contrainte unique (Postgres)
            if (error.code === '23505') {
                if (error.constraint === 'utilisateur_pseudonyme_key') {
                    throw new Error("Ce pseudonyme est déjà utilisé. Veuillez en choisir un autre.");
                } else if (error.constraint === 'utilisateur_email_key') {
                    throw new Error("Cette adresse email est déjà utilisée.");
                } else {
                    throw new Error("Cette information est déjà utilisée par un autre utilisateur.");
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

            const emailToCompare = Buffer.isBuffer(u.email) ? u.email.toString() : u.email;
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

        const isPasswordValid = await comparePassword(motDePasse, user.motDePasse);
        if (!isPasswordValid) {
            throw new Error("Mot de passe incorrect");
        }

        return user;
    }

    // ----------------------------
    // 3️⃣ Enregistrement psychologue (email clair + pas de pseudonyme obligatoire)
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

        const isPasswordValid = await comparePassword(motDePasse, user.motDePasse);
        if (!isPasswordValid) {
            throw new Error("Mot de passe incorrect");
        }

        return user;
    }
}
