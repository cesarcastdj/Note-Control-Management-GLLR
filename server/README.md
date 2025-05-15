# Servidor GLLR - Note Control Management

Este es el servidor backend para el sistema de gestión de notas GLLR.

## Requisitos Previos

- Node.js (v14 o superior)
  - Windows: Descarga e instala desde [nodejs.org](https://nodejs.org/)
  - macOS: Instala via Homebrew o desde [nodejs.org](https://nodejs.org/)
- npm (v6 o superior) - incluido con Node.js
- TypeScript instalado globalmente:
  ```bash
  # Windows/macOS
  npm install -g typescript
  ```

## Instalación

1. Clona el repositorio (si aún no lo has hecho):
```bash
# Si tienes Git instalado:
git clone <url-del-repositorio>

# Windows
cd server

# macOS/Linux
cd server
```

2. Instala las dependencias:
```bash
npm install
```

## Configuración

El servidor utiliza varios archivos de configuración importantes:

- `src/data/users.json`: Contiene la información de los usuarios del sistema
- Las credenciales por defecto son:
  - Admin: admin@gllr.com (contraseña: 123456)
  - Estudiante: student@gllr.com (contraseña: 123456)

## Scripts Disponibles

Ejecuta estos comandos en la terminal (Command Prompt, PowerShell o Terminal):

- `npm run dev`: Inicia el servidor en modo desarrollo con hot-reload
- `npm run build`: Compila el código TypeScript a JavaScript
- `npm start`: Inicia el servidor en modo producción
- `npm run generate-passwords`: Regenera las contraseñas de los usuarios (útil para desarrollo)

## Estructura del Proyecto

```
server/
├── src/
│   ├── data/          # Archivos de datos JSON
│   ├── scripts/       # Scripts de utilidad
│   └── ...           # Otros archivos del servidor
├── package.json
└── tsconfig.json
```

## Notas de Seguridad

- Las contraseñas están hasheadas usando bcrypt
- Por defecto, el servidor se ejecuta en el puerto 3000
- En producción, asegúrate de cambiar las contraseñas por defecto

## Solución de Problemas

### Windows
1. Si encuentras el error "command not found: typescript" o "'typescript' no se reconoce como un comando interno o externo":
   - Asegúrate de tener TypeScript instalado globalmente: `npm install -g typescript`
   - Verifica que la variable de entorno PATH incluya: `%AppData%\npm`
   - Reinicia la terminal después de la instalación

2. Si tienes problemas con los permisos:
   - Ejecuta PowerShell como administrador
   - Ejecuta: `Set-ExecutionPolicy RemoteSigned`

### macOS/Linux
1. Si encuentras el error "command not found: typescript":
   - Verifica la instalación global: `npm install -g typescript`
   - Asegúrate que /usr/local/bin está en tu PATH

### Problemas Comunes
- Si el puerto 3000 está ocupado, verifica que no haya otra aplicación usando ese puerto
- Para errores de dependencias, intenta:
  ```bash
  npm clean-install
  ```

Para cualquier otro problema, verifica los logs del servidor en la consola. 