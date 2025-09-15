// import { RegisterPatientService } from "./Auth.service";
// import { Request, Response } from "express";
// import { IUser } from "./Auth.model";
// import { generateToken } from "../../shared/utils/jswtUtils";

// export class RegisterPatientController {
//   static async registerPatient(req: Request, res: Response) {
//     try {
//       const { pseudonyme, motDePasse, email, role } = req.body;

//       // Appel au service pour enregistrer un utilisateur
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
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Erreur interne du serveur" });
//     }
//   }

//   static async login(req: Request, res: Response) {
//     try {
//       const { email, motDePasse } = req.body;

//       // Appel au service pour connecter un utilisateur
//       const user = await RegisterPatientService.login(email, motDePasse);

//       // Génération du token JWT
//       const token = generateToken({
//         id: user.id,
//         email: user.email,
//         role: user.role,
//       });

//       res.status(200).json({
//         success: true,
//         token,
//         user,
//       });
//     } catch (err: any) {
//       console.error(err);

//       // Gestion des erreurs spécifiques
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

//   //registerPsychologue
//   static async registerPsychologue(req: Request, res: Response) {
//     try {
//       const {
//         nom,
//         prenom,
//         motDePasse,
//         email_clair,
//         domaines,
//         sujets,
//         methodes,
//         description,
//         motivation,
//         cvUrl,
//       } = req.body;

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

//       res
//         .status(201)
//         .json({ 
//             message: "Psychologue enregistré avec succès",
//             data: user 
//         });
//     } catch (error: any) {
//       res.status(400).json({ error: error.message });
//     }
//   }

//   static async loginByClearEmail(req: Request, res: Response) {
//     try {
//       const { email_clair, motDePasse } = req.body;

//       // Appel au service pour connecter un utilisateur avec un email en clair
//       const user = await RegisterPatientService.loginByClearEmail(
//         email_clair,
//         motDePasse
//       );

//       // Génération du token JWT
//       const token = generateToken({
//         id: user.id,
//         email_clair: user.email_clair,
//         role: user.role,
//       });

//       res.status(200).json({
//         success: true,
//         token,
//         user,
//       });
//       console.log(user);
//     } catch (err: any) {
//       console.error(err);
//       res.status(400).json({ error: err.message });
//     }
//   }
// }
import { RegisterPatientService } from "./Auth.service";
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
}
