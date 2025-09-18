// export type UserRole = "patient" | "psychologue" | "admin";

// export interface IUser {
//   id?: string;                // UUID
//   pseudonyme?: string;        // VARCHAR(50), unique (optionnel pour psy/admin)
//   motDePasse: string;        // VARCHAR
//   email?: string | null;     // Hash/crypt email patient (string)
//   email_clair?: string | null; // VARCHAR(100) (pour psy/admin)
//   dateCreation: Date;        // TIMESTAMP DEFAULT now()
//   role: UserRole;            // patient | psychologue | admin
//   nom?: string | null; // VARCHAR(100), optionnel (par ex. pour psy/admin)
//   prenom?: string | null; // VARCHAR(100), optionnel (par ex. pour psy/admin)
// }

// export interface ITherapistProfile {
//   userId: string; // FK vers IUser.id
//   domaines: string[]; 
//   sujets: string[];
//   methodes: string[];
//   description: string;
//   cvUrl?: string; // lien vers le CV stocké
//   motivation: string;
// }
// export interface IOTP {
//   id?: number;
//   userId: string;
//   otp: string;
//   type: "activation" | "reset";
//   expiresAt: Date;
//   used?: boolean;
//   createdAt?: Date;
// }
export type UserRole = "patient" | "psychologue" | "admin";

export interface IUser {
  id?: string;                // UUID
  pseudonyme?: string;        // VARCHAR(50), unique (optionnel pour psy/admin)
  motDePasse: string;        // VARCHAR
  email?: string | null;     // Hash/crypt email patient (string)
  email_clair?: string | null; // VARCHAR(100) (pour psy/admin)
  dateCreation: Date;        // TIMESTAMP DEFAULT now()
  role: UserRole;            // patient | psychologue | admin
  nom?: string | null; // VARCHAR(100), optionnel (par ex. pour psy/admin)
  prenom?: string | null; // VARCHAR(100), optionnel (par ex. pour psy/admin)
}

export interface ITherapistProfile {
  userId: string; // FK vers IUser.id
  domaines: string[]; 
  sujets: string[];
  methodes: string[];
  description: string;
  cvUrl?: string; // lien vers le CV stocké
  motivation: string;
}
export interface IOTP {
  id?: number;
  userId: string;
  otp: string;
  type: "activation" | "reset";
  expiresAt: Date;
  used?: boolean;
  createdAt?: Date;
}
