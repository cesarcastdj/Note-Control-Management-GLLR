import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: number;
    role: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'No se proporcionó token de autenticación'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'somesecrettoken') as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token inválido'
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

export const isStudent = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'student') {
        return res.status(403).json({
            message: 'Acceso denegado: se requiere rol de estudiante'
        });
    }
    next();
}; 