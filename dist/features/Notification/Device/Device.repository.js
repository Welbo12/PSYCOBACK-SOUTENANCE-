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
exports.saveDeviceToken = saveDeviceToken;
exports.findPsychologistTokens = findPsychologistTokens;
// import pool from "../config/db";
const client_1 = __importDefault(require("../../../shared/database/client"));
function saveDeviceToken(userId, token) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client_1.default.query(`INSERT INTO user_devices (user_id, device_token)
     VALUES ($1, $2)
     ON CONFLICT (user_id, device_token) DO NOTHING`, [userId, token]);
    });
}
function findPsychologistTokens() {
    return __awaiter(this, arguments, void 0, function* (limit = 10) {
        const result = yield client_1.default.query(`SELECT d.device_token 
     FROM user_devices d
     JOIN utilisateur u ON u.id = d.user_id
     WHERE u.role = 'psychologue'
     LIMIT $1`, [limit]);
        return result.rows.map((r) => r.device_token);
    });
}
