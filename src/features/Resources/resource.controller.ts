// import { Request, Response } from 'express';
// import service from './resource.service.js';

// export class ResourceController {
//   async create(req: Request, res: Response) {
//     try {
//       const resource = await service.create(req.body);
//       res.status(201).json(resource);
//     } catch (err: any) {
//       res.status(400).json({ error: err.message });
//     }
//   }

//   async list(req: Request, res: Response) {
//     const resources = await service.list({ status: req.query.status as string | undefined });
//     res.json(resources);
//   }

//   async get(req: Request, res: Response) {
//     const item = await service.get(req.params.id);
//     if (!item) return res.status(404).json({ error: 'Not found' });
//     res.json(item);
//   }

//   async update(req: Request, res: Response) {
//     const item = await service.update(req.params.id, req.body);
//     if (!item) return res.status(404).json({ error: 'Not found' });
//     res.json(item);
//   }

//   async remove(req: Request, res: Response) {
//     await service.remove(req.params.id);
//     res.status(204).send();
//   }
// }

// export default new ResourceController();


// src/controllers/resource.controller.ts
import { Request, Response } from 'express';
import * as resourceService from './resource.service';

export const createResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const resource = await resourceService.createResource(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la ressource.' });
  }
};

export const getResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const resources = await resourceService.getResources();
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des ressources.' });
  }
};

export const getResourceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const resource = await resourceService.getResourceById(req.params.id);
    if (!resource) {
      res.status(404).json({ error: 'Ressource non trouvée.' });
      return;
    }
    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la ressource.' });
  }
};

export const updateResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const resource = await resourceService.updateResource(req.params.id, req.body);
    if (!resource) {
      res.status(404).json({ error: 'Ressource non trouvée.' });
      return;
    }
    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la ressource.' });
  }
};

export const deleteResource = async (req: Request, res: Response): Promise<void> => {
  try {
    await resourceService.deleteResource(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la ressource.' });
  }
};
