"use strict";
// import { Request, Response } from 'express';
// import service from './resource.service.js';
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResource = exports.updateResource = exports.getResourceById = exports.getResources = exports.createResource = void 0;
const resourceService = __importStar(require("./resource.service"));
const createResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resource = yield resourceService.createResource(req.body);
        res.status(201).json(resource);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la ressource.' });
    }
});
exports.createResource = createResource;
const getResources = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resources = yield resourceService.getResources();
        res.status(200).json(resources);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des ressources.' });
    }
});
exports.getResources = getResources;
const getResourceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resource = yield resourceService.getResourceById(req.params.id);
        if (!resource) {
            res.status(404).json({ error: 'Ressource non trouvée.' });
            return;
        }
        res.status(200).json(resource);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la ressource.' });
    }
});
exports.getResourceById = getResourceById;
const updateResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resource = yield resourceService.updateResource(req.params.id, req.body);
        if (!resource) {
            res.status(404).json({ error: 'Ressource non trouvée.' });
            return;
        }
        res.status(200).json(resource);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la ressource.' });
    }
});
exports.updateResource = updateResource;
const deleteResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield resourceService.deleteResource(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la ressource.' });
    }
});
exports.deleteResource = deleteResource;
