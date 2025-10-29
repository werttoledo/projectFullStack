const express = require('express');
const router = express.Router();
const {listarTareas, crearTarea, aactualizarTarea, eliminarTarea} = require('../controllers/tasKesController');


// Definir rutas para las tareas
// Ruta para el GET
router.get('/tasks', listarTareas);
// Ruta para el POST
router.post('/tasks', crearTarea);
// Ruta para el PUT
router.put('/tasks/:id', actualizarTarea);
// ruta para el DELETE
router.delete('/tasks/:id', eliminarTarea);
module.exports = router;
