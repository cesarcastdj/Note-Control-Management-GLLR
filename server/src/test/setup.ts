import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

// Configurar variables de entorno para pruebas
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key';

// Crear una instancia de Sequelize para pruebas usando SQLite en memoria
export const testSequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
});

// Conectar a la base de datos de prueba antes de las pruebas
beforeAll(async () => {
    try {
        await testSequelize.authenticate();
        await testSequelize.sync({ force: true });
    } catch (error) {
        console.error('Error al configurar la base de datos de prueba:', error);
        process.exit(1);
    }
});

// Limpiar todas las tablas después de cada prueba
afterEach(async () => {
    try {
        await testSequelize.sync({ force: true });
    } catch (error) {
        console.error('Error al limpiar la base de datos de prueba:', error);
    }
});

// Cerrar la conexión después de todas las pruebas
afterAll(async () => {
    await testSequelize.close();
}); 