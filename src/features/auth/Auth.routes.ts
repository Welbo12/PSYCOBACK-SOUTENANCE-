import { Router } from "express";
import { RegisterPatientController } from "./Auth.controller";
import { authenticate } from "../../shared/middlewares/authMiddleware";

const router = Router();

router.post("/register/patient", RegisterPatientController.registerPatient);
router.post("/login", RegisterPatientController.login);
   router.get("/patients/count", RegisterPatientController.countPatients);
router.post("/loginByClearEmail", RegisterPatientController.loginByClearEmail);
router.post("/request-otp", RegisterPatientController.requestOTP);

// Vérification OTP
router.post("/verify-otp", RegisterPatientController.verifyOTP);

// Reset password après vérification OTP
router.post("/reset-password", RegisterPatientController.resetPassword);


router.post(
  "/register/psychologue",
  RegisterPatientController.registerPsychologue
);

export default router;
