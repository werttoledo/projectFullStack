// Requerir modelo de tareas
const pool = require('../config/db');

// Lista de tareas  GET
const listarTareas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tareas ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear tarea POST
const crearTarea = async (req, res) => {
    try {
        const { titulo, descripcion } = req.body;
        const result = await pool.query(
            'INSERT INTO tareas (titulo, descripcion) VALUES ($1, $2) RETURNING *',
            [titulo, descripcion]
        );
        res.status(201).json(result.rows[0]); // ✅ respuesta exitosa
    } catch (error) {
        res.status(500).json({ error: error.message }); // ✅ manejar errores
    }
};
// PUT -> Actualizar tarea
const actualizarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, estado } = req.body;
    const result = await pool.query(
        'UPDATE tareas SET titulo = $1, descripcion=$2, estado=$3 WHERE id =$4 RETURNING *'
        [titulo, descripcion, estado, id] 
    );

    res.json(result.rows[0]);

  } catch (error) {
        res.status(500).json({ error: error.message });
  }
};

// DELETE -> Eliminar tarea
const eliminarTarea = async (req, res) => {
   try{
     const{id} = req.params;
     const result = await pool.query(
        'DELETE FROM tareas WHERE id = $1', [id]);
        res.json({message: 'Tarea eliminada correctamente'});
    }  catch (error) {
        res.status(500).json({ error: error.message });
   }
};





// Exportar controladores de tareas
module.exports = {
    listarTareas,
    crearTarea
};


//docker compose up --build -d
//docker composer up 