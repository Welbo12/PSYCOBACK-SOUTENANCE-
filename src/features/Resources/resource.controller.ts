import { Request, Response } from 'express';
import service from './resource.service.js';

export class ResourceController {
  async create(req: Request, res: Response) {
    try {
      const resource = await service.create(req.body);
      res.status(201).json(resource);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    const resources = await service.list({ status: req.query.status as string | undefined });
    res.json(resources);
  }

  async get(req: Request, res: Response) {
    const item = await service.get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  }

  async update(req: Request, res: Response) {
    const item = await service.update(req.params.id, req.body);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  }

  async remove(req: Request, res: Response) {
    await service.remove(req.params.id);
    res.status(204).send();
  }
}

export default new ResourceController();


