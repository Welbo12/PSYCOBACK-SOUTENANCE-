"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Availability_controller_1 = require("./Availability.controller");
const authMiddleware_1 = require("../../shared/middlewares/authMiddleware");
const authorizeRoleMiddleware_1 = require("../../shared/middlewares/authorizeRoleMiddleware");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent un token et le rôle psychologue ou admin
router.use(authMiddleware_1.authenticate);
router.use((0, authorizeRoleMiddleware_1.authorizeRole)(["psychologue", "admin"]));
// POST /api/availability (providerId issu du token)
router.post("/", Availability_controller_1.AvailabilityController.createOrUpdate);
// GET /api/availability/:providerId
router.get("/:providerId", Availability_controller_1.AvailabilityController.list);
// DELETE /api/availability/:providerId/:iso
router.delete("/:providerId/:iso", Availability_controller_1.AvailabilityController.remove);
exports.default = router;
