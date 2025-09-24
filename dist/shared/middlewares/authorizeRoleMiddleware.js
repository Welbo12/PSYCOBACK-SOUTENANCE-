"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
const authorizeRole = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !roles.includes(user.role)) {
            return res
                .status(403)
                .json({ success: false, message: "Accès refusé : rôle non autorisé" });
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
