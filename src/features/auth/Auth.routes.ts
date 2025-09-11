import { Router } from "express";
import {RegisterPatientController} from "./Auth.controller";
import {authenticate} from "../../shared/middlewares/authMiddleware";

const router = Router();

router.post("/register/patient", RegisterPatientController.registerPatient);
router.post("/login",   RegisterPatientController.login);

export default router;
