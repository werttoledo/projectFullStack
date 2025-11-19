# TaskHub - Aplicación de Gestión de Tareas

Este es un proyecto Full Stack para la gestión de tareas, implementado con Node.js, Express, PostgreSQL y Docker.

## Tecnologías Utilizadas

### Backend
- Node.js con Express
- PostgreSQL como base de datos
- Docker para containerización
- dotenv para variables de entorno

### Infraestructura
- Docker Compose para orquestación de servicios
- pgAdmin para administración de la base de datos

## Configuración del Proyecto

### Base de Datos (PostgreSQL en Docker)
- **Host**: 
- **Puerto**: 
- **Base de datos**: 
- **Usuario**: 
- **Contraseña**: 

### pgAdmin (Interfaz de Administración)
- **URL**: http://localhost:5050
- **Email**: admin@uniminuto.edu
- **Contraseña**: admin

## Estructura del Proyecto 
```
backend/
 ├── src/
 │   ├── config/
 │   │   └── db.js         # Configuración de la base de datos
 │   ├── routes/
 │   │   └── index.js      # Definición de rutas
 │   ├── controllers/
 │   │   └── taskController.js  # Controladores de tareas
 │   └── app.js           # Archivo principal de la aplicación
 ├── .env                 # Variables de entorno (no versionado)
 └── package.json        # Dependencias del proyecto
```

## API Endpoints Implementados

### Tareas
- `GET /api/tasks` - Listar todas las tareas
- `POST /api/tasks` - Crear una nueva tarea
- `PUT /api/tasks/:id` - Actualizar una tarea existente
- `DELETE /api/tasks/:id` - Eliminar una tarea

## Características Implementadas

1. **Configuración del Proyecto**
   - Estructura de carpetas organizada
   - Configuración de Docker y Docker Compose
   - Gestión de dependencias con npm

2. **Base de Datos**
   - Contenedor Docker para PostgreSQL
   - Interfaz pgAdmin para administración
   - Persistencia de datos con volúmenes Docker

3. **Backend**
   - Servidor Express configurado
   - Conexión a PostgreSQL
   - CRUD completo para tareas
   - Manejo de errores
   - Variables de entorno

## Comandos Útiles

### Docker
```bash
# Iniciar servicios
docker compose up --build -d

# Detener servicios
docker compose down
```

### Desarrollo
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```



Setup rápido para el backend (Windows)

Objetivo: crear el usuario/BD y la tabla necesarias para que la app funcione con las credenciales en `backend/.env`.

1) Requisitos
- PostgreSQL instalado (asegúrate de que `psql` esté en el PATH o conoce la ruta a `psql.exe`).

2) Ejecutar los scripts (PowerShell)
- Abre PowerShell en la carpeta `backend` del proyecto.
- Ejecuta:

```powershell
# si psql está en PATH
.\init_db.ps1

# O ejecutar psql directamente (te pedirá la contraseña del usuario postgres)
psql -U postgres -h localhost -p 5432 -f .\init_db.sql
```

3) Verificar
- Inicia el backend:

```powershell
cd backend
npm run dev
```

- En la consola deberías ver que el servidor arranca sin errores de autenticación. Luego prueba con curl:

```powershell
curl -X POST http://localhost:5000/api/tasks -H "Content-Type: application/json" -d '{"titulo":"Prueba","descripcion":"desde curl"}'
```

4) Qué hacer si no tienes la contraseña del superusuario `postgres`
- Usa pgAdmin para crear un role `admin` y la base `taskhub` (GUI).
- O cambia `backend/.env` para poner un usuario/contraseña existentes en tu PostgreSQL y reinicia el backend.

Notas finales
- Si tu PostgreSQL usa autenticación distinta (ident/peer), modifica `pg_hba.conf` para permitir md5 si deseas autenticación por contraseña.
- Si quieres, puedo crear el role y la DB desde Node.js, pero eso requiere un usuario con permisos de superusuario disponible en `.env` (no recomendable en producción).