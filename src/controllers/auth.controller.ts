import { Request, Response } from "express";
import { User } from "../models/user.model";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = new User({ username, email, password, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
};

export const refreshToken = (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    res.status(401).json({ message: "Access Denied" });
    return Promise.resolve();
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET ?? "") as { userId: string };
    const newAccessToken = generateAccessToken(decoded.userId, "user");
    res.json({ accessToken: newAccessToken });
    return Promise.resolve();
  } catch (error) {
    res.status(403).json({ message: "Invalid Refresh Token" });
    return Promise.resolve();
  }
};
