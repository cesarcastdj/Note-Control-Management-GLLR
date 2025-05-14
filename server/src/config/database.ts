import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

const dbName = process.env.DB_NAME || 'gllr_db';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '3306');

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mariadb',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export const connectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        // Sincronizar modelos con la base de datos
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('Modelos sincronizados con la base de datos.');
        }
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        process.exit(1);
    }
}; 