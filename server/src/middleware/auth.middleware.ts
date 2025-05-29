import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

interface TokenPayload {
  id: number;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        message: 'No hay token de autenticación'
      });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Token inválido'
    });
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({
      message: 'Acceso denegado. Se requieren privilegios de administrador'
    });
    return;
  }
  next();
};

export const studentMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'estudiante') {
    res.status(403).json({
      message: 'Acceso denegado. Se requieren privilegios de estudiante'
    });
    return;
  }
  next();
};