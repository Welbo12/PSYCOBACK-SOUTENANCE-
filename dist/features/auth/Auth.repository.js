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
exports.AuthRepository = void 0;
const client_1 = __importDefault(require("../../shared/database/client"));
class AuthRepository {
    static createPatient(pseudonyme, motDePasse, email, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return client_1.default.query("INSERT INTO utilisateur (pseudonyme, motDePasse, email , role) VALUES ($1, $2, $3, $4) RETURNING *", [pseudonyme, motDePasse, email, role]);
        });
    }
    static findByMail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Rechercher l'utilisateur avec un email crypté
            const result = yield client_1.default.query("SELECT * FROM utilisateur WHERE email = $1", [email]);
            return result.rows[0];
        });
    }
    static findByClearEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Rechercher l'utilisateur avec un email en clair (si nécessaire pour d'autres rôles)
            const result = yield client_1.default.query("SELECT * FROM utilisateur WHERE email_clair = $1", [email]);
            return result.rows[0];
        });
    }
}
exports.AuthRepository = AuthRepository;
