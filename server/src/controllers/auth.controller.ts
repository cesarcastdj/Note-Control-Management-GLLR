import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Función para leer usuarios del archivo JSON
const getUsersFromFile = (): any[] => {
    const filePath = path.join(__dirname, '../data/users.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent).users;
};

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
        const users = getUsersFromFile();

        // Buscar usuario por email
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({
                message: 'Usuario o contraseña incorrectos'
            });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Usuario o contraseña incorrectos'
            });
        }

        // Crear token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'somesecrettoken',
            { expiresIn: '1d' }
        );

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({
            message: 'Error en el servidor',
            error
        });
    }
};

export const register = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password, firstName, lastName, role } = req.body;

        // Verificar si el usuario ya existe
        const users = getUsersFromFile();
        const userExists = users.find(u => u.email === email);
        if (userExists) {
            return res.status(400).json({
                message: 'El usuario ya existe'
            });
        }

        // Crear nuevo usuario
        const user = {
            id: Date.now(),
            email,
            password,
            firstName,
            lastName,
            role
        };

        // Guardar usuario en el archivo JSON
        const filePath = path.join(__dirname, '../data/users.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const usersData = JSON.parse(fileContent);
        usersData.users.push(user);
        fs.writeFileSync(filePath, JSON.stringify(usersData));

        // Crear token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'somesecrettoken',
            { expiresIn: '1d' }
        );

        return res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error en el servidor',
            error
        });
    }
}; 