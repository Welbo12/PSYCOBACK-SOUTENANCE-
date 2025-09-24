import { Router } from 'express';
import controller from './resource.controller.js';
import { createUploadSignature } from '../../shared/utils/cloudinary.js';

const router = Router();

router.get('/', (req, res) => controller.list(req, res));
router.post('/', (req, res) => controller.create(req, res));


// Endpoint pour récupérer une signature d'upload Cloudinary côté client
router.get('/upload/signature', (req, res) => {
	try {
		const folder = (req.query.folder as string) || undefined;
		const payload = createUploadSignature({ folder });
		res.json(payload);
	} catch (err: any) {
		res.status(500).json({ error: err.message || 'Signature error' });
	}
});
router.get('/:id', (req, res) => controller.get(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.remove(req, res));
export default router;


