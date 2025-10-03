import { Router } from "express";
import { AvailabilityController } from "./Availability.controller";
import { authenticate } from "../../shared/middlewares/authMiddleware";
import { authorizeRole } from "../../shared/middlewares/authorizeRoleMiddleware";

const router = Router();

// GET public (consultation)
router.get("/:providerId", AvailabilityController.list);

// Routes protégées pour modification
router.use(authenticate, authorizeRole(["psychologue", "admin"]));

// POST /api/availability (providerId issu du token)
router.post("/", AvailabilityController.createOrUpdate);

// DELETE /api/availability/:providerId/:iso
router.delete("/:providerId/:iso", AvailabilityController.remove);

export default router;


