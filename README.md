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