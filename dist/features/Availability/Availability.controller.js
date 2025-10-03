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
exports.AvailabilityController = void 0;
const Availability_service_1 = require("./Availability.service");
exports.AvailabilityController = {
    createOrUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const payload = Object.assign(Object.assign({}, req.body), { providerId: user === null || user === void 0 ? void 0 : user.id });
                const result = yield Availability_service_1.AvailabilityService.saveSlots(payload);
                res.status(200).json(Object.assign({ success: true }, result));
            }
            catch (error) {
                res.status(400).json({ success: false, message: error.message });
            }
        });
    },
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const providerId = req.params.providerId;
            if (!providerId)
                return res.status(400).json({ message: "providerId requis" });
            const rows = yield Availability_service_1.AvailabilityService.list(providerId);
            res.status(200).json(rows);
        });
    },
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const providerId = req.params.providerId;
            const iso = req.params.iso;
            if (!providerId || !iso)
                return res.status(400).json({ message: "paramètres manquants" });
            const deleted = yield Availability_service_1.AvailabilityService.removeSlot(providerId, iso);
            res.status(200).json({ deleted });
        });
    },
};
