"use strict";
// import { Pool } from 'pg';
// import { Resource } from './resource.model.js';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResource = exports.updateResource = exports.getResourceById = exports.getResources = exports.createResource = void 0;
const client_1 = __importDefault(require("../../shared/database/client"));
// ✅ Création
const createResource = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield client_1.default.query(`INSERT INTO resources (type, content, author, link, description, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`, [data.type, data.content, data.author, data.link, data.description, data.status]);
    return result.rows[0];
});
exports.createResource = createResource;
// ✅ Récupérer toutes
const getResources = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield client_1.default.query(`SELECT * FROM resources ORDER BY created_at DESC`);
    return result.rows;
});
exports.getResources = getResources;
// ✅ Récupérer une par ID
const getResourceById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield client_1.default.query(`SELECT * FROM resources WHERE id = $1`, [id]);
    return result.rows[0] || null;
});
exports.getResourceById = getResourceById;
// ✅ Mettre à jour
const updateResource = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const fields = Object.keys(data);
    const values = Object.values(data);
    if (fields.length === 0)
        return null;
    const setQuery = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const result = yield client_1.default.query(`UPDATE resources SET ${setQuery}, updated_at = NOW() WHERE id = $1 RETURNING *`, [id, ...values]);
    return result.rows[0] || null;
});
exports.updateResource = updateResource;
// ✅ Supprimer
const deleteResource = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.default.query(`DELETE FROM resources WHERE id = $1`, [id]);
});
exports.deleteResource = deleteResource;
