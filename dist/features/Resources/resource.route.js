"use strict";
// import { Router } from 'express';
// import controller from './resource.controller';
// import { createUploadSignature } from '../../shared/utils/cloudinary.js';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// router.get('/', (req, res) => controller.list(req, res));
// router.post('/', (req, res) => controller.create(req, res));
// // Endpoint pour récupérer une signature d'upload Cloudinary côté client
// router.get('/upload/signature', (req, res) => {
// 	try {
// 		const folder = (req.query.folder as string) || undefined;
// 		const payload = createUploadSignature({ folder });
// 		res.json(payload);
// 	} catch (err: any) {
// 		res.status(500).json({ error: err.message || 'Signature error' });
// 	}
// });
// router.get('/:id', (req, res) => controller.get(req, res));
// router.put('/:id', (req, res) => controller.update(req, res));
// router.delete('/:id', (req, res) => controller.remove(req, res));
// export default router;
// src/routes/resource.routes.ts
const express_1 = require("express");
const resourceController = __importStar(require("./resource.controller"));
const router = (0, express_1.Router)();
router.post('/', resourceController.createResource);
router.get('/', resourceController.getResources);
router.get('/:id', resourceController.getResourceById);
router.put('/:id', resourceController.updateResource);
router.delete('/:id', resourceController.deleteResource);
exports.default = router;
