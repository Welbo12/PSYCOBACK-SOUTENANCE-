export interface IJournal {
  id?: string;             // UUID
  utilisateurId: string;   // FK vers IUser.id
  contenu?: string;        // Texte du journal, optionnel
  dateCreation?: Date;     // Date de création
}