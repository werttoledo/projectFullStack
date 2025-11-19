const express = require('express');
const router = express.Router();
const {listarTareas, crearTarea, actualizarTarea, eliminarTarea} = require('../controllers/taskController');
const { listarCategorias, crearCategoria, eliminarCategoria } = require('../controllers/categoriaController');
const { login, register } = require('../controllers/authController');


// Rutas legacy en inglés (compatibilidad)
router.get('/tasks', listarTareas);
router.post('/tasks', crearTarea);
router.put('/tasks/:id', actualizarTarea);
router.delete('/tasks/:id', eliminarTarea);

// Rutas en español solicitadas por el proyecto
router.get('/tareas', listarTareas);
router.post('/tareas', crearTarea);
router.put('/tareas/:id', actualizarTarea);
router.delete('/tareas/:id', eliminarTarea);

// Rutas para categorias
router.get('/categorias', listarCategorias);
router.post('/categorias', crearCategoria);
router.delete('/categorias/:id', eliminarCategoria);

// Auth
router.post('/auth/login', login);
router.post('/auth/register', register);

module.exports = router;
