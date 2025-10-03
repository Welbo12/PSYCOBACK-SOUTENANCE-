"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_controller_1 = require("./Auth.controller");
const authMiddleware_1 = require("../../shared/middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post("/register/patient", Auth_controller_1.RegisterPatientController.registerPatient);
router.post("/login", Auth_controller_1.RegisterPatientController.login);
router.get("/patients/count", Auth_controller_1.RegisterPatientController.countPatients);
router.get("/psychologues/count", Auth_controller_1.RegisterPatientController.countPsychologues);
router.post("/loginByClearEmail", Auth_controller_1.RegisterPatientController.loginByClearEmail);
router.post("/request-otp", Auth_controller_1.RegisterPatientController.requestOTP);
// Vérification OTP
router.post("/verify-otp", Auth_controller_1.RegisterPatientController.verifyOTP);
// Reset password après vérification OTP
router.post("/reset-password", Auth_controller_1.RegisterPatientController.resetPassword);
// Changer mot de passe (authentifié)
router.post("/change-password", authMiddleware_1.authenticate, Auth_controller_1.RegisterPatientController.changePassword);
router.post("/request-deletion", authMiddleware_1.authenticate, Auth_controller_1.RegisterPatientController.requestDeletion);
router.post("/register/psychologue", Auth_controller_1.RegisterPatientController.registerPsychologue);
// Psychologist applications
router.get("/psychologues/applications", Auth_controller_1.PsychologistApplicationsController.list);
router.post("/psychologues/:id/approve", Auth_controller_1.PsychologistApplicationsController.approve);
exports.default = router;
