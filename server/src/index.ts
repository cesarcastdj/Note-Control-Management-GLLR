import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';

// Rutas
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import studentRoutes from './routes/student.routes';

// Configuración de variables de entorno
config();

// Inicialización de la aplicación
const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

export { app }; 