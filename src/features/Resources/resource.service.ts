// import { z } from 'zod';
// import repo from './resource.repository.js';
// import { Resource } from './resource.model.js';

// export const createResourceSchema = z.object({
//   type: z.enum(['text', 'image', 'video']),
//   content: z.string().min(1),
//   author: z.string().min(1).optional().nullable(),
//   link: z.string().url().optional(),
//   description: z.string().max(2000).optional(),
//   status: z.enum(['draft', 'published', 'archived']).optional(),
// });

// export class ResourceService {
//   async create(input: unknown): Promise<Resource> {
//     const data = createResourceSchema.parse(input);
//     return repo.create(data as Partial<Resource>);
//   }

//   async list(filter: { status?: string } = {}): Promise<Resource[]> {
//     return repo.findAll(filter);
//   }

//   async get(id: string): Promise<Resource | null> {
//     return repo.findById(id);
//   }

//   async update(id: string, input: Partial<Resource>): Promise<Resource | null> {
//     return repo.update(id, input);
//   }

//   async remove(id: string): Promise<void> {
//     return repo.delete(id);
//   }
// }

// export default new ResourceService();


// src/services/resource.service.ts
import { Resource } from './resource.model';
import * as resourceRepository from './resource.repository';

export const createResource = async (data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resource> => {
  return await resourceRepository.createResource(data);
};

export const getResources = async (): Promise<Resource[]> => {
  return await resourceRepository.getResources();
};

export const getResourceById = async (id: string): Promise<Resource | null> => {
  return await resourceRepository.getResourceById(id);
};

export const updateResource = async (
  id: string,
  data: Partial<Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Resource | null> => {
  return await resourceRepository.updateResource(id, data);
};

export const deleteResource = async (id: string): Promise<void> => {
  await resourceRepository.deleteResource(id);
};
