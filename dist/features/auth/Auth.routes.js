"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_controller_1 = require("./Auth.controller");
const router = (0, express_1.Router)();
router.post("/register/patient", Auth_controller_1.RegisterPatientController.registerPatient);
router.post("/login", Auth_controller_1.RegisterPatientController.login);
exports.default = router;
