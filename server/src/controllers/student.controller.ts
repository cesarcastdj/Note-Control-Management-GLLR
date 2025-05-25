import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Request as ExpressRequest } from 'express-serve-static-core';
import { Student } from '../models/student.model';
import multer from 'multer';

// Simulación de base de datos
const students = [
  { id: 1, name: 'Cesar Castañeda', email: 'HolaMundo@gmail.com', profilePicture: '' },
];

export interface MulterRequest extends ExpressRequest {
  file?: Express.Multer.File;
}

const upload = multer();

export const updateProfile = (req: MulterRequest, res: Response) => {
  const { id, name, email, phone } = req.body;
  const profilePicture = req.file;

  const student: Student | undefined = students.find((student) => student.id === parseInt(id));

  if (!student) {
    return res.status(404).json({ message: 'Estudiante no encontrado' });
  }

  student.name = name || student.name;
  student.email = email || student.email;
  student.phone = phone || student.phone;

  if (profilePicture) {
    const uploadPath = path.join(__dirname, '../../uploads', profilePicture.originalname);
    fs.writeFileSync(uploadPath, profilePicture.buffer);
    student.profilePicture = `/uploads/${profilePicture.originalname}`;
  }

  res.json({ message: 'Perfil actualizado con éxito', student });
};
