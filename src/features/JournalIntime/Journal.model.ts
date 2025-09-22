export interface IJournal {
  id?: string;              // UUID généré automatiquement
  utilisateurId: string;    // FK vers IUser.id
  contenu: string;          // Texte du journal (obligatoire)
  dateCreation?: Date;      // Date de création (auto par défaut)
}