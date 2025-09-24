"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Device_controller_1 = require("./Device.controller");
// const router = express.Router();
// router.post("/devices", registerDevice);
// export default router;
const authMiddleware_1 = require("../../../shared/middlewares/authMiddleware");
;
// 💾 Tout utilisateur connecté (patient/psy/admin) peut enregistrer son device
const router = express_1.default.Router();
router.post("/devices", authMiddleware_1.authenticate, Device_controller_1.registerDevice);
exports.default = router;
