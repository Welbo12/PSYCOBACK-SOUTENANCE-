"use strict";
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
exports.JournalRepository = void 0;
const client_1 = __importDefault(require("../../shared/database/client"));
class JournalRepository {
    // ➤ Créer une nouvelle entrée dans le journal
    static create(utilisateurId, contenu) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_1.default.query(`INSERT INTO journal (utilisateur_id, contenu)
       VALUES ($1, $2)
       RETURNING *`, [utilisateurId, contenu]);
            return result.rows[0];
        });
    }
    // ➤ Récupérer toutes les entrées d’un utilisateur (ordre chronologique inverse)
    static findByUser(utilisateurId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_1.default.query(`SELECT * FROM journal
       WHERE utilisateur_id = $1
       ORDER BY date_creation DESC`, [utilisateurId]);
            return result.rows;
        });
    }
    // ➤ Mettre à jour une entrée spécifique par son id
    static updateById(id, contenu) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client_1.default.query(`UPDATE journal
       SET contenu = $2
       WHERE id = $1
       RETURNING *`, [id, contenu]);
            return result.rows[0] || null;
        });
    }
    // ➤ Supprimer une entrée spécifique
    static deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield client_1.default.query(`DELETE FROM journal WHERE id = $1`, [id]);
        });
    }
}
exports.JournalRepository = JournalRepository;
