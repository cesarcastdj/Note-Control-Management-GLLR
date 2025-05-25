import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Request as ExpressRequest } from 'express-serve-static-core';

interface JwtPayload {
    id: number;
    role: string;
}

export interface AuthenticatedRequest extends ExpressRequest {
  user?: JwtPayload;
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        message: 'No se proporcionó token de autenticación',
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'somesecrettoken') as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Token inválido o expirado',
    });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({
            message: 'Acceso denegado: se requiere rol de administrador'
        });
    }
    next();
};

export const isStudent = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'student') {
    res.status(403).json({
      message: 'Acceso denegado: se requiere rol de estudiante',
    });
    return;
  }
  next();
};