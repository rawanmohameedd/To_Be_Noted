"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            res.status(403).json({ message: "Forbidden: You donnot have permission to do this action" });
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
