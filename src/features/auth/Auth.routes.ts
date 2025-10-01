import { Router } from "express";
import { RegisterPatientController, PsychologistApplicationsController } from "./Auth.controller";
import { authenticate } from "../../shared/middlewares/authMiddleware";

const router = Router();

router.post("/register/patient", RegisterPatientController.registerPatient);
router.post("/login", RegisterPatientController.login);
   router.get("/patients/count", RegisterPatientController.countPatients);
   router.get("/psychologues/count", RegisterPatientController.countPsychologues);
router.post("/loginByClearEmail", RegisterPatientController.loginByClearEmail);
router.post("/request-otp", RegisterPatientController.requestOTP);

// Vérification OTP
router.post("/verify-otp", RegisterPatientController.verifyOTP);

// Reset password après vérification OTP
router.post("/reset-password", RegisterPatientController.resetPassword);

// Changer mot de passe (authentifié)
router.post("/change-password", authenticate, RegisterPatientController.changePassword);
router.post("/request-deletion", authenticate, RegisterPatientController.requestDeletion);

router.post(
  "/register/psychologue",
  RegisterPatientController.registerPsychologue
);

// Psychologist applications
router.get("/psychologues/applications", PsychologistApplicationsController.list);
router.post("/psychologues/:id/approve", PsychologistApplicationsController.approve);

export default router;
