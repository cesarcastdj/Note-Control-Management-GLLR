import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { validateLogin } from '../middleware/auth.validator';

const router = Router();

// Rutas de autenticación
router.post('/login', validateLogin, login);

export default router; 