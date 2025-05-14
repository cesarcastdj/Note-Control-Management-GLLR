import { Router } from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.middleware';

const router = Router();

// Ruta de prueba para verificar acceso de admin
router.get('/dashboard', verifyToken, isAdmin, (req, res) => {
    res.json({
        message: 'Acceso concedido al panel de administrador',
        user: req.user
    });
});

export default router; 