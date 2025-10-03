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
exports.AvailabilityRepository = void 0;
const client_1 = __importDefault(require("../../shared/database/client"));
exports.AvailabilityRepository = {
    upsertSlots(providerId, slots) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!slots.length)
                return 0;
            const values = [];
            const placeholders = [];
            slots.forEach((d, i) => {
                values.push(providerId, d.toISOString());
                placeholders.push(`($${2 * i + 1}, $${2 * i + 2})`);
            });
            const query = `
      INSERT INTO availability_slots (provider_id, slot_time)
      VALUES ${placeholders.join(", ")}
      ON CONFLICT (provider_id, slot_time) DO NOTHING
    `;
            const res = yield client_1.default.query(query, values);
            return res.rowCount || 0;
        });
    },
    listByProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield client_1.default.query(`SELECT id, provider_id, slot_time, is_booked, created_at
       FROM availability_slots
       WHERE provider_id = $1
       ORDER BY slot_time ASC`, [providerId]);
            return rows;
        });
    },
    deleteSlot(providerId, slotIso) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rowCount } = yield client_1.default.query(`DELETE FROM availability_slots WHERE provider_id = $1 AND slot_time = $2 AND is_booked = false`, [providerId, slotIso]);
            return rowCount || 0;
        });
    },
};
