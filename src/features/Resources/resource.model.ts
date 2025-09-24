// // Passage à Prisma/PostgreSQL: ce fichier exporte uniquement les types partagés
// export type ResourceType = 'text' | 'image' | 'video';

// export interface Resource {
//   id: string;
//   type: ResourceType;
//   content: string;
//   author?: string | null;
//   link?: string | null;
//   description?: string | null;
//   status: 'draft' | 'published' | 'archived';
//   createdAt: Date;
//   updatedAt: Date;
// }



// Types/Interfaces partagés
export type ResourceType = 'text' | 'image' | 'video';

export interface Resource {
  id: string;
  type: ResourceType;
  content: string;
  author?: string | null;
  link?: string | null;
  description?: string | null;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}
