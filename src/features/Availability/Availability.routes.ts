import { Router } from "express";
import { AvailabilityController } from "./Availability.controller";
import { authenticate } from "../../shared/middlewares/authMiddleware";
import { authorizeRole } from "../../shared/middlewares/authorizeRoleMiddleware";

const router = Router();

// Toutes les routes nécessitent un token et le rôle psychologue ou admin
router.use(authenticate);
router.use(authorizeRole(["psychologue", "admin"]));

// POST /api/availability (providerId issu du token)
router.post("/", AvailabilityController.createOrUpdate);

// GET /api/availability/:providerId
router.get("/:providerId", AvailabilityController.list);

// DELETE /api/availability/:providerId/:iso
router.delete("/:providerId/:iso", AvailabilityController.remove);

export default router;


