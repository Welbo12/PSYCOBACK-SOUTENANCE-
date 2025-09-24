// // import { Router } from 'express';
// // import controller from './resource.controller';
// // import { createUploadSignature } from '../../shared/utils/cloudinary.js';

// // const router = Router();

// // router.get('/', (req, res) => controller.list(req, res));
// // router.post('/', (req, res) => controller.create(req, res));


// // // Endpoint pour récupérer une signature d'upload Cloudinary côté client
// // router.get('/upload/signature', (req, res) => {
// // 	try {
// // 		const folder = (req.query.folder as string) || undefined;
// // 		const payload = createUploadSignature({ folder });
// // 		res.json(payload);
// // 	} catch (err: any) {
// // 		res.status(500).json({ error: err.message || 'Signature error' });
// // 	}
// // });
// // router.get('/:id', (req, res) => controller.get(req, res));
// // router.put('/:id', (req, res) => controller.update(req, res));
// // router.delete('/:id', (req, res) => controller.remove(req, res));
// // export default router;


// // src/routes/resource.routes.ts
// import { Router } from 'express';
// import * as resourceController from './resource.controller';

// const router = Router();

// router.post('/', resourceController.createResource);
// router.get('/', resourceController.getResources);
// router.get('/:id', resourceController.getResourceById);
// router.put('/:id', resourceController.updateResource);
// router.delete('/:id', resourceController.deleteResource);

// export default router;
import { Router } from 'express';
import * as resourceController from './resource.controller';
import { createUploadSignature } from '../../shared/utils/cloudinary';

const router = Router();

router.get('/upload/signature', (req, res) => {
  try {
    const folder = (req.query.folder as string) || undefined;
    const payload = createUploadSignature({ folder });
    res.json(payload);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Signature error' });
  }
});

router.post('/', resourceController.createResource);
router.get('/', resourceController.getResources);
router.get('/:id', resourceController.getResourceById);
router.put('/:id', resourceController.updateResource);
router.delete('/:id', resourceController.deleteResource);

export default router;