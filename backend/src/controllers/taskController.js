// Requerir modelo de tareas
const pool = require('../config/db');

// Helper: obtener usuario por id
const getUserById = async (id) => {
    if (!id) return null;
    const res = await pool.query('SELECT id, nombre, email, is_admin FROM usuarios WHERE id = $1', [id]);
    return res.rowCount ? res.rows[0] : null;
};

// Lista de tareas  GET
const listarTareas = async (req, res) => {
    try {
        // Permitir filtrar por usuario_id: /tareas?usuario_id=1
        const { usuario_id, categoria_id } = req.query;
        let query = 'SELECT t.* FROM tareas t';
        const clauses = [];
        const params = [];
        if (usuario_id) {
            params.push(usuario_id);
            clauses.push(`t.usuario_id = $${params.length}`);
        }
        if (categoria_id) {
            params.push(categoria_id);
            clauses.push(`t.categoria_id = $${params.length}`);
        }
        if (clauses.length > 0) {
            query += ' WHERE ' + clauses.join(' AND ');
        }
        query += ' ORDER BY t.id ASC';
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear tarea POST
const crearTarea = async (req, res) => {
    try {
        const { titulo, descripcion, categoria_id, usuario_id } = req.body;
        console.log('Recibido:', { titulo, descripcion, categoria_id, usuario_id });

        // Validar campos requeridos
        if (!titulo || !descripcion) {
            return res.status(400).json({ error: 'Título y descripción son requeridos' });
        }

        // usuario_id es requerido - debe ser el usuario logueado
        if (!usuario_id) {
            return res.status(400).json({ error: 'usuario_id es requerido para crear la tarea' });
        }

        // Verificar que el usuario existe
        const owner = await getUserById(usuario_id);
        if (!owner) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        // Cualquier usuario logueado puede crear tareas para sí mismo
        // Insertar la tarea con el usuario_id del usuario logueado
        const result = await pool.query(
            'INSERT INTO tareas (titulo, descripcion, categoria_id, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [titulo, descripcion, categoria_id || null, usuario_id]
        );
        
        console.log('Tarea creada:', result.rows[0]);
        res.status(201).json({ message: 'Tarea creada exitosamente', task: result.rows[0] });
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({ error: error.message });
    }
};
// PUT -> Actualizar tarea
const actualizarTarea = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, estado, categoria_id, usuario_id } = req.body;
        
        // usuario_id es requerido - debe ser el usuario logueado
        if (!usuario_id) {
            return res.status(400).json({ error: 'usuario_id es requerido' });
        }

        const requester = await getUserById(usuario_id);
        if (!requester) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        // Obtener tarea para comprobar ownership
        const tareaRes = await pool.query('SELECT * FROM tareas WHERE id = $1', [id]);
        if (tareaRes.rowCount === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        
        const tarea = tareaRes.rows[0];

        // Solo el dueño de la tarea puede actualizarla (o admin)
        if (tarea.usuario_id !== Number(usuario_id) && !requester.is_admin) {
            return res.status(403).json({ error: 'Solo puedes actualizar tus propias tareas' });
        }

        const result = await pool.query(
            'UPDATE tareas SET titulo = $1, descripcion=$2, estado=$3, categoria_id=$4 WHERE id =$5 RETURNING *',
            [titulo, descripcion, estado, categoria_id || null, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        res.json({ message: 'Tarea actualizada exitosamente', task: result.rows[0] });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE -> Eliminar tarea
const eliminarTarea = async (req, res) => {
    try {
      const { id } = req.params;
      // Para DELETE, el usuario_id viene en query params
      const usuario_id = req.query?.usuario_id || req.body?.usuario_id;
      
      if (!usuario_id) {
        return res.status(400).json({ error: 'usuario_id es requerido' });
      }
      
      // Convertir a número si es string
      const usuarioIdNum = Number(usuario_id);
      if (isNaN(usuarioIdNum)) {
        return res.status(400).json({ error: 'usuario_id debe ser un número válido' });
      }
      
      const requester = await getUserById(usuarioIdNum);
      if (!requester) {
        return res.status(400).json({ error: 'Usuario no encontrado' });
      }

      const tareaRes = await pool.query('SELECT * FROM tareas WHERE id = $1', [id]);
      if (tareaRes.rowCount === 0) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
      
      const tarea = tareaRes.rows[0];

      // Solo el dueño de la tarea puede eliminarla (o admin)
      if (tarea.usuario_id !== usuarioIdNum && !requester.is_admin) {
        return res.status(403).json({ error: 'Solo puedes eliminar tus propias tareas' });
      }

      const result = await pool.query('DELETE FROM tareas WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
      
      res.json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
      console.error('Error eliminar tarea:', error);
      res.status(500).json({ error: error.message || 'Error interno del servidor' });
    }
};





// Exportar controladores de tareas
module.exports = {
    listarTareas,
    crearTarea,
    actualizarTarea,
    eliminarTarea
};


//docker compose up --build -d
//docker composer up 