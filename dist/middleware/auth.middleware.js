"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateUser = (req, res, next) => {
    var _a, _b;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Access Denied' });
        //401 => Unauthorized
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, (_b = process.env.ACCESS_TOKEN_SECRET) !== null && _b !== void 0 ? _b : '');
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid Token' });
        return;
        //403 => Forbidden
    }
};
exports.authenticateUser = authenticateUser;
