"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jswtUtils_1 = require("../utils/jswtUtils");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ success: false, message: "Token manquant ou invalide" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = (0, jswtUtils_1.verifyToken)(token);
    if (!decoded) {
        return res
            .status(401)
            .json({ success: false, message: "Token invalide ou expiré" });
    }
    req.user = decoded;
    next();
};
exports.authenticate = authenticate;
