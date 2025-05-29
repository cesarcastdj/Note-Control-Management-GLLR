import { Router } from 'express';
import { getStudentGrades } from '../controllers/grade.controller';
import { verifyToken, isStudent } from '../middleware/auth.middleware';

const router = Router();

// Ruta para obtener las notas del estudiante autenticado
router.get('/student', verifyToken, isStudent, getStudentGrades);

export default router;