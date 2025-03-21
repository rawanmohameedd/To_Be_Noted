import jwt from "jsonwebtoken";
import * as dotenv from "dotenv"; 
dotenv.config(); 

export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET ?? "", { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET ?? "", { expiresIn: "7d" });
};
