import { Router } from "express";
import { AvailabilityController } from "./Availability.controller";

const router = Router();

// POST /api/availability
router.post("/", AvailabilityController.createOrUpdate);

// GET /api/availability/:providerId
router.get("/:providerId", AvailabilityController.list);

// DELETE /api/availability/:providerId/:iso
router.delete("/:providerId/:iso", AvailabilityController.remove);

export default router;


