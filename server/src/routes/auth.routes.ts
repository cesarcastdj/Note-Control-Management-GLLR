import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

// Rutas públicas
router.post('/register', (req, res) => {
    authController.register(req, res);
});

router.post('/login', (req, res) => {
    authController.login(req, res);
});

// Rutas protegidas
router.get('/verify', authMiddleware, (req, res) => {
    authController.verifyToken(req, res);
});

export default router; 