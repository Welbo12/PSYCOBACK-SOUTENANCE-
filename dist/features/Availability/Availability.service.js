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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityService = void 0;
const zod_1 = require("zod");
const Availability_repository_1 = require("./Availability.repository");
const SlotsSchema = zod_1.z.object({
    providerId: zod_1.z.string().min(1),
    slots: zod_1.z
        .array(zod_1.z.object({ iso: zod_1.z.string().datetime() }))
        .min(1),
});
exports.AvailabilityService = {
    saveSlots(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = SlotsSchema.parse(payload);
            const slots = data.slots
                .map((s) => new Date(s.iso))
                .filter((d) => !Number.isNaN(d.getTime()));
            const inserted = yield Availability_repository_1.AvailabilityRepository.upsertSlots(data.providerId, slots);
            return { inserted };
        });
    },
    list(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Availability_repository_1.AvailabilityRepository.listByProvider(providerId);
        });
    },
    removeSlot(providerId, iso) {
        return __awaiter(this, void 0, void 0, function* () {
            return Availability_repository_1.AvailabilityRepository.deleteSlot(providerId, iso);
        });
    },
};
