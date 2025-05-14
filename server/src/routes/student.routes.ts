import { Router } from 'express';
import { verifyToken, isStudent } from '../middleware/auth.middleware';

const router = Router();

// Ruta de prueba para verificar acceso de estudiante
router.get('/dashboard', verifyToken, isStudent, (req, res) => {
    res.json({
        message: 'Acceso concedido al panel de estudiante',
        user: req.user
    });
});

export default router; 