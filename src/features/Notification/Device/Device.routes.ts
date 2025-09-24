import express from "express";
import { registerDevice } from "./Device.controller";

// const router = express.Router();

// router.post("/devices", registerDevice);

// export default router;


import { authenticate } from "../../../shared/middlewares/authMiddleware";
import { authorizeRole } from "../../../shared/middlewares/authorizeRoleMiddleware";;

// 💾 Tout utilisateur connecté (patient/psy/admin) peut enregistrer son device
const router = express.Router();

router.post(
  "/devices",
  authenticate,
  registerDevice
);

export default router;
