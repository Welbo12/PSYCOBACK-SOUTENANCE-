import { z } from 'zod';
import repo from './resource.repository.js';
import { Resource } from './resource.model.js';

export const createResourceSchema = z.object({
  type: z.enum(['text', 'image', 'video']),
  content: z.string().min(1),
  author: z.string().min(1).optional().nullable(),
  link: z.string().url().optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

export class ResourceService {
  async create(input: unknown): Promise<Resource> {
    const data = createResourceSchema.parse(input);
    return repo.create(data as Partial<Resource>);
  }

  async list(filter: { status?: string } = {}): Promise<Resource[]> {
    return repo.findAll(filter);
  }

  async get(id: string): Promise<Resource | null> {
    return repo.findById(id);
  }

  async update(id: string, input: Partial<Resource>): Promise<Resource | null> {
    return repo.update(id, input);
  }

  async remove(id: string): Promise<void> {
    return repo.delete(id);
  }
}

export default new ResourceService();


