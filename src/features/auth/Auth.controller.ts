
// import { RegisterPatientService } from "./Auth.service";
// import { AuthRepository } from "./Auth.repository";
// import { Request, Response } from "express";
// import { generateToken } from "../../shared/utils/jswtUtils";
 

// export class RegisterPatientController {
//   // ----------------------------
//   // 1️⃣ Patient register
//   // ----------------------------
//   static async registerPatient(req: Request, res: Response) {
//     try {
//       const { pseudonyme, motDePasse, email, role } = req.body;

//       if (!pseudonyme || !motDePasse || !email || !role) {
//         return res.status(400).json({ error: "Champs obligatoires manquants" });
//       }

//       const user = await RegisterPatientService.registerPatient(
//         pseudonyme,
//         motDePasse,
//         email,
//         role
//       );

//       res.status(201).json({
//         message: "Patient enregistré avec succès",
//         data: user,
//       });
//     } catch (err: any) {
//       res.status(400).json({ error: err.message });
//     }
//   }

//   // ----------------------------
//   // 2️⃣ Patient login
//   // ----------------------------
//   static async login(req: Request, res: Response) {
//     try {
//       const { email, motDePasse } = req.body;
//       if (!email || !motDePasse) {
//         return res.status(400).json({ error: "Champs obligatoires manquants" });
//       }

//       const user = await RegisterPatientService.login(email, motDePasse);
//       const token = generateToken({ id: user.id, role: user.role });

//       res.status(200).json({ success: true, token, user });
//     } catch (err: any) {
//       if (
//         err.message === "Utilisateur introuvable" ||
//         err.message === "Mot de passe incorrect" ||
//         err.message === "Compte utilisateur invalide - mot de passe manquant"
//       ) {
//         return res.status(401).json({ error: err.message });
//       }
//       res.status(500).json({ error: "Erreur interne du serveur" });
//     }
//   }

//   // ----------------------------
//   // 3️⃣ Psychologue register
//   // ----------------------------
//   static async registerPsychologue(req: Request, res: Response) {
//     try {
//       const { nom, prenom, motDePasse, email_clair, domaines, sujets, methodes, description, motivation, cvUrl } = req.body;

//       if (!nom || !prenom || !motDePasse || !email_clair) {
//         return res.status(400).json({ error: "Champs obligatoires manquants" });
//       }

//       const user = await RegisterPatientService.registerPsychologue(
//         nom,
//         prenom,
//         motDePasse,
//         email_clair,
//         domaines || [],
//         sujets || [],
//         methodes || [],
//         description || "",
//         motivation || "",
//         cvUrl
//       );

//       res.status(201).json({ message: "Psychologue enregistré avec succès", data: user });
//     } catch (err: any) {
//       res.status(400).json({ error: err.message });
//     }
//   }

//   // ----------------------------
//   // 4️⃣ Psychologue login (email clair)
//   // ----------------------------
//   static async loginByClearEmail(req: Request, res: Response) {
//     try {
//       const { email_clair, motDePasse } = req.body;
//       if (!email_clair || !motDePasse) {
//         return res.status(400).json({ error: "Champs obligatoires manquants" });
//       }

//       const user = await RegisterPatientService.loginByClearEmail(email_clair, motDePasse);
//       const token = generateToken({ id: user.id, role: user.role });

//       res.status(200).json({ success: true, token, user });
//     } catch (err: any) {
//       if (err.message === "Utilisateur introuvable" || err.message === "Mot de passe incorrect") {
//         return res.status(401).json({ error: err.message });
//       }
//       res.status(500).json({ error: "Erreur interne du serveur" });
//     }
//   }



//   static async requestOTP(req: Request, res: Response) {
//     try {
//       const { userId, email_clair, type } = req.body;

//       if ((!userId && !email_clair) || !type) {
//         return res.status(400).json({ error: "Fournir userId ou email_clair, et type" });
//       }

//       if (type !== "activation" && type !== "reset") {
//         return res.status(400).json({ error: "Type OTP invalide" });
//       }

//       // Si email_clair fourni, résoudre userId en BDD (sans vérifier le mot de passe)
//       let targetUserId = userId as string;
//       if (!targetUserId && email_clair) {
//         const u = await AuthRepository.findByClearEmail(email_clair);
//         if (!u) return res.status(404).json({ error: "Utilisateur introuvable" });
//         targetUserId = u.id as string;
//       }

//       const result = await RegisterPatientService.sendOTP(targetUserId, type);
//       res.status(200).json(result);

//     } catch (err: any) {
//       console.error(err);
//       res.status(500).json({ error: "Erreur interne du serveur" });
//     }
//   }

//   // ----------------------------
//   // Vérification OTP
//   // ----------------------------
//   static async verifyOTP(req: Request, res: Response) {
//     try {
//       const { userId, otp, type } = req.body;

//       if (!userId || !otp || !type) {
//         return res.status(400).json({ error: "Champs obligatoires manquants" });
//       }

//       if (type !== "activation" && type !== "reset") {
//         return res.status(400).json({ error: "Type OTP invalide" });
//       }

//       const result = await RegisterPatientService.verifyOTP(userId, otp, type);
//       res.status(200).json(result);

//     } catch (err: any) {
//       console.error(err);
//       // Cas OTP invalide ou expiré
//       if (err.message.includes("OTP invalide") || err.message.includes("Nouveau mot de passe requis")) {
//         return res.status(400).json({ error: err.message });
//       }
//       res.status(500).json({ error: "Erreur interne du serveur" });
//     }
//   }
// }

import { RegisterPatientService } from "./Auth.service";
import { AuthRepository } from "./Auth.repository";
import { Request, Response } from "express";
import { generateToken } from "../../shared/utils/jswtUtils";
 

export class RegisterPatientController {
  // ----------------------------
  // 1️⃣ Patient register
  // ----------------------------
  static async registerPatient(req: Request, res: Response) {
    try {
      const { pseudonyme, motDePasse, email, role } = req.body;

      if (!pseudonyme || !motDePasse || !email || !role) {
        return res.status(400).json({ error: "Champs obligatoires manquants" });
      }

      const user = await RegisterPatientService.registerPatient(
        pseudonyme,
        motDePasse,
        email,
        role
      );

      res.status(201).json({
        message: "Patient enregistré avec succès",
        data: user,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // ----------------------------
  // 2️⃣ Patient login
  // ----------------------------
  static async login(req: Request, res: Response) {
    try {
      const { email, motDePasse } = req.body;
      if (!email || !motDePasse) {
        return res.status(400).json({ error: "Champs obligatoires manquants" });
      }

      const user = await RegisterPatientService.login(email, motDePasse);
      const token = generateToken({ id: user.id, role: user.role });

      res.status(200).json({ success: true, token, user });
    } catch (err: any) {
      if (
        err.message === "Utilisateur introuvable" ||
        err.message === "Mot de passe incorrect" ||
        err.message === "Compte utilisateur invalide - mot de passe manquant"
      ) {
        return res.status(401).json({ error: err.message });
      }
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  // ----------------------------
  // 3️⃣ Psychologue register
  // ----------------------------
  static async registerPsychologue(req: Request, res: Response) {
    try {
      const { nom, prenom, motDePasse, email_clair, domaines, sujets, methodes, description, motivation, cvUrl } = req.body;

      if (!nom || !prenom || !motDePasse || !email_clair) {
        return res.status(400).json({ error: "Champs obligatoires manquants" });
      }

      const user = await RegisterPatientService.registerPsychologue(
        nom,
        prenom,
        motDePasse,
        email_clair,
        domaines || [],
        sujets || [],
        methodes || [],
        description || "",
        motivation || "",
        cvUrl
      );

      res.status(201).json({ message: "Psychologue enregistré avec succès", data: user });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // ----------------------------
  // 4️⃣ Psychologue login (email clair)
  // ----------------------------
  static async loginByClearEmail(req: Request, res: Response) {
    try {
      const { email_clair, motDePasse } = req.body;
      if (!email_clair || !motDePasse) {
        return res.status(400).json({ error: "Champs obligatoires manquants" });
      }

      const user = await RegisterPatientService.loginByClearEmail(email_clair, motDePasse);
      const token = generateToken({ id: user.id, role: user.role });

      res.status(200).json({ success: true, token, user });
    } catch (err: any) {
      if (err.message === "Utilisateur introuvable" || err.message === "Mot de passe incorrect") {
        return res.status(401).json({ error: err.message });
      }
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }



  static async requestOTP(req: Request, res: Response) {
    try {
      const { email, type } = req.body;

      if (!email || !type) {
        return res.status(400).json({ error: "Champs obligatoires manquants (email, type)" });
      }

      if (type !== "activation" && type !== "reset") {
        return res.status(400).json({ error: "Type OTP invalide" });
      }

      // Résoudre userId via email clair
      const u = await AuthRepository.findByClearEmail(email);
      if (!u) return res.status(404).json({ error: "Utilisateur introuvable" });
      const targetUserId = u.id as string;

      const result = await RegisterPatientService.sendOTP(targetUserId, type);
      res.status(200).json(result);

    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  // ----------------------------
  // Vérification OTP
  // ----------------------------
  static async verifyOTP(req: Request, res: Response) {
    try {
      const { email, otp, type } = req.body;

      if (!email || !otp || !type) {
        return res.status(400).json({ error: "Champs obligatoires manquants (email, otp, type)" });
      }

      if (type !== "activation" && type !== "reset") {
        return res.status(400).json({ error: "Type OTP invalide" });
      }

      // Résoudre userId via email clair
      const u = await AuthRepository.findByClearEmail(email);
      if (!u) return res.status(404).json({ error: "Utilisateur introuvable" });
      const userId = u.id as string;

      const result = await RegisterPatientService.verifyOTP(userId, otp, type);
      res.status(200).json(result);

    } catch (err: any) {
      console.error(err);
      // Cas OTP invalide ou expiré
      if (err.message.includes("OTP invalide") || err.message.includes("Nouveau mot de passe requis")) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }
}
