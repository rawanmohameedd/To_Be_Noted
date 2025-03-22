"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = exports.register = void 0;
const user_model_1 = require("../models/user.model");
const jwt_1 = require("../utils/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = yield user_model_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const user = new user_model_1.User({ username, email, password, role });
        yield user.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user.id, user.role);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        res.status(200).json({ accessToken, refreshToken });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.login = login;
const refreshToken = (req, res) => {
    var _a;
    const refreshToken = req.body.token;
    if (!refreshToken) {
        res.status(401).json({ message: "Access Denied" });
        return Promise.resolve();
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, (_a = process.env.REFRESH_TOKEN_SECRET) !== null && _a !== void 0 ? _a : "");
        const newAccessToken = (0, jwt_1.generateAccessToken)(decoded.userId, "user");
        res.json({ accessToken: newAccessToken });
        return Promise.resolve();
    }
    catch (error) {
        res.status(403).json({ message: "Invalid Refresh Token" });
        return Promise.resolve();
    }
};
exports.refreshToken = refreshToken;
