page.jsx -> listas de las tareas
Add/page.jsx -> Formulario para agregar tareas
layout -> Navbar + estilos globales, footer, etc ....




- interface Task { ... } ➜ Declara la forma exacta de los objetos que vienen desde el backend
- useState<Task[]>([]) ➜ Indica que el estado es un arreglo de tareas Task[], no un arreglo vacío genérico
- axios.get<Task[]>() ➜ Le dice a Axios: "esta petición devuelve un array de Task"
- t.descripcion ➜ Ahora VS Code sabe que 't' es un Task, reconoce el título, descripción, etc...



# 📋 Guía Completa - Sistema de Gestión de Tareas (Full Stack)

## 🎯 Proyecto Completado

Este proyecto incluye todas las funcionalidades requeridas para la electiva React & Next.js:

✅ CRUD completo de tareas  
✅ Gestión de categorías con colores  
✅ Integración de categorías a tareas  
✅ Autenticación básica (login/register)  
✅ Control de acceso por usuario  
✅ UI mejorada con estilos  

---

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```powershell
# Frontend
cd frontend
npm install

# Backend
cd ..\backend
npm install
```

### 2. Configurar Base de Datos PostgreSQL

Ejecuta los siguientes scripts en orden en PostgreSQL:

```powershell
# 1. Crear tabla de categorías
psql -U admin -d taskhub -f backend/create_categorias.sql

# 2. Crear tabla de usuarios
psql -U admin -d taskhub -f backend/create_usuarios.sql

# 3. Alterar tabla tareas para agregar categoria_id
psql -U admin -d taskhub -f backend/alter_tareas_categorias.sql

# 4. Alterar tabla tareas para agregar usuario_id
psql -U admin -d taskhub -f backend/alter_tareas_usuario.sql
```

O usa `psql` interactivo:

```powershell
psql -U admin -d taskhub

# Ejecuta los contenidos de cada archivo SQL
```

### 3. Configurar Variables de Entorno

Verifica que `backend/.env` tenga:

```env
DB_USER=admin
DB_PASSWORD=12345
DB_NAME=taskhub
DB_HOST=localhost
DB_PORT=5432
PORT=5000
```

---

## 🏃 Ejecutar el Proyecto

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
# Debe mostrar: "Servidor escuchando en el puerto 5000"
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
# Debe abrir: http://localhost:4000
```

---

## 🔐 Datos de Prueba

### Credenciales de Login

```
Email: test@example.com
Contraseña: test123
```

### Categorías Predeterminadas

- **Estudio** (amarillo claro: #fef3c7)
- **Trabajo** (verde claro: #dcfce7)
- **Hobby** (azul claro: #dbeafe)

---

## 📱 Funcionalidades Implementadas

### 1. Autenticación
- Página `/login` con email y contraseña
- Validación de credenciales
- Almacenamiento de `userId` en localStorage
- Redirección automática si no hay sesión

### 2. CRUD de Tareas
- ✅ **CREATE**: Formulario en `/add` con categoría opcional
- ✅ **READ**: Listado en `/` (solo tareas del usuario logueado)
- ✅ **UPDATE**: Página de edición en `/edit/[id]`
- ✅ **DELETE**: Botón eliminar con confirmación

### 3. Categorías
- Página `/categorias` para crear y listar categorías
- Colores personalizables
- Integración en tareas (select al crear/editar)
- Visualización en listado (badge de color)

### 4. Control de Acceso
- Filtro por `usuario_id` en GET tareas
- Validación de propiedad al actualizar/eliminar
- Redirección a login si no hay usuario
- Botón de "Cerrar Sesión"

### 5. UI/UX Mejorada
- Estilos en tarjetas (task-item)
- Botones con colores y estados
- Formularios con validaciones
- Responsive design (mobile-friendly)
- Modo oscuro/claro compatible

---

## 📂 Estructura de Carpetas

```
projectFullStack/
├── backend/
│   ├── src/
│   │   ├── app.js                    # Express app
│   │   ├── config/db.js              # Pool PostgreSQL
│   │   ├── controllers/
│   │   │   ├── taskController.js     # CRUD tareas
│   │   │   ├── categoriaController.js # CRUD categorías
│   │   │   └── authController.js     # Login/register
│   │   └── routes/index.js           # Rutas API
│   ├── .env                          # Variables de entorno
│   ├── create_categorias.sql         # Script DB
│   ├── create_usuarios.sql           # Script DB
│   ├── alter_tareas_categorias.sql   # Script DB
│   ├── alter_tareas_usuario.sql      # Script DB
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── page.tsx                  # Home (lista tareas)
    │   ├── login/page.tsx            # Login
    │   ├── add/page.jsx              # Crear tarea
    │   ├── edit/[id]/page.tsx        # Editar tarea
    │   ├── categorias/page.tsx       # Gestionar categorías
    │   ├── api/
    │   │   ├── tasks/route.ts        # Proxy GET/POST tareas
    │   │   ├── tasks/[id]/route.ts   # Proxy PUT/DELETE tareas
    │   │   ├── categorias/route.ts   # Proxy GET/POST categorías
    │   │   ├── categorias/[id]/route.ts # Proxy PUT/DELETE categorías
    │   │   └── auth/login/route.ts   # Proxy POST login
    │   ├── globals.css               # Estilos globales
    │   └── layout.tsx                # Layout principal
    └── package.json
```

---

## 🔌 API Endpoints (Backend)

### Tareas
- `GET /api/tasks?usuario_id=X` → Listar tareas del usuario
- `POST /api/tasks` → Crear tarea (requiere usuario_id)
- `PUT /api/tasks/:id` → Editar tarea
- `DELETE /api/tasks/:id?usuario_id=X` → Eliminar tarea

### Categorías
- `GET /api/categorias` → Listar todas las categorías
- `POST /api/categorias` → Crear categoría
- `PUT /api/categorias/:id` → Editar categoría
- `DELETE /api/categorias/:id` → Eliminar categoría

### Autenticación
- `POST /api/auth/login` → Login (email, password)
- `POST /api/auth/register` → Registrar usuario (email, password, nombre)

---

## 🛠️ Tecnologías Usadas

**Frontend:**
- Next.js 14+ (App Router)
- React 18+
- Axios
- CSS personalizado

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- nodemon (desarrollo)

**Base de Datos:**
- PostgreSQL 12+
- Tablas: usuarios, categorias, tareas

---

## 📝 Notas Importantes

1. **Seguridad**: Las contraseñas se almacenan en texto plano (desarrollo). En producción, usar bcrypt.
2. **JWT**: El proyecto usa `userId` simple. En producción, implementar JWT.
3. **CORS**: El proxy en Next.js evita problemas de CORS.
4. **Puertos**: 
   - Frontend: 4000
   - Backend: 5000
   - PostgreSQL: 5432

---

## 🐛 Troubleshooting

### Error: "Servidor no conecta"
- Verifica que PostgreSQL está corriendo
- Verifica variables en `.env`
- Reinicia el backend con `npm run dev`

### Error: "Login fallido"
- Verifica que la tabla `usuarios` existe
- Confirma que el usuario test@example.com existe
- Revisa los logs del backend

### Tareas no cargan en home
- Verifica que estás logueado (check localStorage)
- Abre DevTools y verifica la solicitud GET /api/tasks

---

## ✅ Checklist de Verificación

- [ ] PostgreSQL corriendo
- [ ] Backend en puerto 5000 (npm run dev)
- [ ] Frontend en puerto 4000 (npm run dev)
- [ ] Puedes hacer login con test@example.com / test123
- [ ] Puedes crear una tarea
- [ ] Puedes ver la tarea en el listado
- [ ] Puedes editar la tarea
- [ ] Puedes eliminar la tarea
- [ ] Puedes crear una categoría
- [ ] Puedes asignar categoría a una tarea
- [ ] El badge de categoría aparece en el listado
- [ ] Puedes cerrar sesión
- [ ] Redirige a login si no hay usuario logueado

---

## 📧 Contacto / Soporte

Si encuentras problemas, verifica los logs del backend y los DevTools del navegador.

**Happy coding! 🚀**
