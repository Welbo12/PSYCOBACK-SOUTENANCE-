import express from "express";
import { emergencyAlert } from "./Emergencie.controller";

// const router = express.Router();

// router.post("/emergency", emergencyAlert);

// export default router;







import { authenticate } from "../../../shared/middlewares/authMiddleware";
import { authorizeRole } from "../../../shared/middlewares/authorizeRoleMiddleware";

const router = express.Router();

// 🔒 Seul un patient peut déclencher une urgence
router.post("/emergency",
  authenticate,
  authorizeRole(["patient"]),
  emergencyAlert
);

export default router;
