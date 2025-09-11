export type UserRole = "patient" | "psychologue" | "admin";

export interface IUser {
  id?: string;                // UUID
  pseudonyme: string;        // VARCHAR(50), unique
  motDePasse: string;        // VARCHAR
  email?: Buffer | null;     // BYTEA (email crypté)
  email_clair?: string | null; // VARCHAR(100) (pour psy/admin)
  dateCreation: Date;        // TIMESTAMP DEFAULT now()
  role: UserRole;            // patient | psychologue | admin
}