import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

async function generatePasswords() {
    try {
        const filePath = path.join(__dirname, '../data/users.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const usersData = JSON.parse(fileContent);

        // Generar nuevos hashes para las contraseñas
        for (const user of usersData.users) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash('123456', salt);
        }

        // Guardar el archivo actualizado
        fs.writeFileSync(filePath, JSON.stringify(usersData, null, 2));
        console.log('Contraseñas actualizadas exitosamente');
    } catch (error) {
        console.error('Error:', error);
    }
}

generatePasswords(); 