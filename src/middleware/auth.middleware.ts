import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// include user property in request interface
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: string };
    }
  }
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Access Denied' });
    //401 => Unauthorized
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET ?? '') as { userId: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid Token' });
    return;
    //403 => Forbidden
  }
};
