import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

export const validateLogin = [
    check('email', 'Por favor ingrese un email válido').isEmail(),
    check('password', 'La contraseña es requerida').not().isEmpty(),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export const validateRegister = [
    check('email', 'Por favor ingrese un email válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('firstName', 'El nombre es requerido').not().isEmpty(),
    check('lastName', 'El apellido es requerido').not().isEmpty(),
    check('role', 'El rol debe ser admin o student').isIn(['admin', 'student']),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]; 