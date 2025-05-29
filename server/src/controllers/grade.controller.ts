import { Request, Response } from 'express';
import Grade from '../models/grade.model';

// Obtener todas las notas del estudiante autenticado
export const getStudentGrades = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const grades = await Grade.find({ studentId });
    return res.json(grades);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener notas', error });
  }
};
