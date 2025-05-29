import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool } from '../database/database';
import { config } from '../config/config';

interface User {
    id_usuario: number;
    primer_nombre: string;
    primer_apellido: string;
    contraseña: string;
    role: string;
}

export class AuthController {
    // Registro de usuario
    public async register(req: Request, res: Response): Promise<void> {
        try {
            const { cedula, primer_nombre, primer_apellido, correo, contraseña, role } = req.body;

            // Verificar si el usuario ya existe
            const [existingUser] = await pool.query(
                'SELECT * FROM usuarios WHERE cedula = ? OR correo = ?',
                [cedula, correo]
            );

            if (Array.isArray(existingUser) && existingUser.length > 0) {
                res.status(400).json({
                    message: 'El usuario ya existe'
                });
                return;
            }

            // Encriptar contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(contraseña, salt);

            // Insertar nuevo usuario
            await pool.query(
                'INSERT INTO usuarios (cedula, primer_nombre, primer_apellido, correo, contraseña, role) VALUES (?, ?, ?, ?, ?, ?)',
                [cedula, primer_nombre, primer_apellido, correo, hashedPassword, role]
            );

            res.status(201).json({
                message: 'Usuario registrado exitosamente'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error al registrar usuario'
            });
        }
    }

    // Login de usuario
    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { correo, contraseña } = req.body;

            // Buscar usuario
            const [users] = await pool.query(
                'SELECT * FROM usuarios WHERE correo = ?',
                [correo]
            );

            if (!Array.isArray(users) || users.length === 0) {
                res.status(400).json({
                    message: 'Credenciales inválidas'
                });
                return;
            }

            const user = users[0] as User;

            // Verificar contraseña
            const validPassword = await bcrypt.compare(contraseña, user.contraseña);
            if (!validPassword) {
                res.status(400).json({
                    message: 'Credenciales inválidas'
                });
                return;
            }

            // Generar token
            const token = jwt.sign(
                { id: user.id_usuario, role: user.role },
                config.jwtSecret,
                { expiresIn: '24h' }
            );

            // Actualizar última conexión
            await pool.query(
                'UPDATE usuarios SET ultima_conexion = NOW() WHERE id_usuario = ?',
                [user.id_usuario]
            );

            res.json({
                token,
                user: {
                    id: user.id_usuario,
                    nombre: user.primer_nombre,
                    apellido: user.primer_apellido,
                    role: user.role
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error al iniciar sesión'
            });
        }
    }

    // Verificar token
    public async verifyToken(req: Request, res: Response): Promise<void> {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');

            if (!token) {
                res.status(401).json({
                    message: 'No hay token de autenticación'
                });
                return;
            }

            const decoded = jwt.verify(token, config.jwtSecret);
            res.json(decoded);
        } catch (error) {
            res.status(401).json({
                message: 'Token inválido'
            });
        }
    }
} 