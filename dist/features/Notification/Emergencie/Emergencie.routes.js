"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Emergencie_controller_1 = require("./Emergencie.controller");
// const router = express.Router();
// router.post("/emergency", emergencyAlert);
// export default router;
const authMiddleware_1 = require("../../../shared/middlewares/authMiddleware");
const authorizeRoleMiddleware_1 = require("../../../shared/middlewares/authorizeRoleMiddleware");
const router = express_1.default.Router();
// 🔒 Seul un patient peut déclencher une urgence
router.post("/emergency", authMiddleware_1.authenticate, (0, authorizeRoleMiddleware_1.authorizeRole)(["patient"]), Emergencie_controller_1.emergencyAlert);
exports.default = router;
