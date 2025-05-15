# Ejecución

Para hacer que el proyecto se ejecute es necesario tener lo siguiente:

- Node.js
- NPM
- Git

---

## Instalación y Configuración

1. Instalar dependencias del frontend (en la raíz del proyecto):
```bash
npm install
```

2. Instalar dependencias del backend:
```bash
cd server
npm install
cd ..
```

## Opciones de Ejecución

### 1. Ejecución Simultánea (Recomendado)
Para iniciar tanto el frontend como el backend con un solo comando:
```bash
npm run start
```
Esto iniciará:
- Frontend en `localhost:4321`
- Backend en `localhost:3000`

Para detener ambos servicios, presiona `Ctrl + C` en la terminal.

### 2. Ejecución por Separado

#### Frontend
```bash
npm run dev        # Inicia el servidor de desarrollo en localhost:4321
```

#### Backend
```bash
cd server
npm run dev        # Inicia el servidor backend en localhost:3000
```

## Comandos Adicionales

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala las dependencias                         |
| `npm run build`           | Construye el sitio de producción en `./dist/`    |
| `npm run preview`         | Vista previa de la build localmente             |
| `npm run astro ...`       | Ejecuta comandos CLI como `astro add`, `astro check` |
| `npm run astro -- --help` | Obtiene ayuda usando Astro CLI                   |

## Credenciales por Defecto

Para probar el sistema, puedes usar las siguientes credenciales:

- **Admin**: 
  - Email: admin@gllr.com
  - Contraseña: 123456
- **Estudiante**:
  - Email: student@gllr.com
  - Contraseña: 123456

## Solución de Problemas

Si encuentras algún error:

1. Asegúrate de que los puertos 4321 y 3000 estén disponibles
2. Verifica que todas las dependencias estén instaladas correctamente
3. Si hay problemas con las dependencias, intenta:
   ```bash
   npm clean-install
   cd server
   npm clean-install
   ```

Para detener cualquier servidor: `Control + C`