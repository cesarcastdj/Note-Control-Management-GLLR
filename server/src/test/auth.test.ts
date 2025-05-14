import request from 'supertest';
import { Express } from 'express';
import mongoose from 'mongoose';
import { app } from '../index';
import User from '../models/user.model';

describe('Auth Controller', () => {
    const testUser = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        role: 'student'
    };

    describe('POST /api/auth/register', () => {
        it('debería registrar un nuevo usuario exitosamente', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('email', testUser.email);
            expect(response.body.user).not.toHaveProperty('password');
        });

        it('debería fallar si el email ya está registrado', async () => {
            // Primero registramos un usuario
            await request(app)
                .post('/api/auth/register')
                .send(testUser);

            // Intentamos registrar el mismo usuario nuevamente
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'El usuario ya existe');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Registrar un usuario antes de las pruebas de login
            await request(app)
                .post('/api/auth/register')
                .send(testUser);
        });

        it('debería hacer login exitosamente con credenciales correctas', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('email', testUser.email);
        });

        it('debería fallar con contraseña incorrecta', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Usuario o contraseña incorrectos');
        });

        it('debería fallar con email no registrado', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: testUser.password
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Usuario o contraseña incorrectos');
        });
    });
}); 