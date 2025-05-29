import { Router, RequestHandler } from 'express';
import { verifyToken, isStudent } from '../middleware/auth.middleware';
import multer from 'multer';
import { updateProfile } from '../controllers/student.controller';
import { MulterRequest } from '../controllers/student.controller';

const router = Router();
const upload = multer();

// Ruta de prueba para verificar acceso de estudiante
router.get('/dashboard', verifyToken, isStudent, (req, res) => {
    res.json({
        message: 'Acceso concedido al panel de estudiante',
        user: req.user
    });
});

// Ajustar tipos para el middleware y controlador
const updateProfileHandler: RequestHandler = (req: MulterRequest, res, next) => {
    updateProfile(req, res);
    next();
};

// Ruta para actualizar perfil
router.post('/update-profile', upload.single('profilePicture'), updateProfileHandler);

export default router;