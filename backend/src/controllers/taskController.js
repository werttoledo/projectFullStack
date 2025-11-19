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
        const { usuario_id, categoria_id } = req.query;

        if (!usuario_id) {
            return res.status(400).json({ error: 'usuario_id es requerido para listar tareas' });
        }

        const usuarioIdNum = Number(usuario_id);
        if (Number.isNaN(usuarioIdNum)) {
            return res.status(400).json({ error: 'usuario_id debe ser un número válido' });
        }

        const owner = await getUserById(usuarioIdNum);
        if (!owner) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        let query = 'SELECT t.* FROM tareas t WHERE t.usuario_id = $1';
        const params = [usuarioIdNum];

        if (categoria_id) {
            const categoriaIdNum = Number(categoria_id);
            if (Number.isNaN(categoriaIdNum)) {
                return res.status(400).json({ error: 'categoria_id debe ser un número válido' });
            }
            params.push(categoriaIdNum);
            query += ` AND t.categoria_id = $${params.length}`;
        }

        query += ' ORDER BY t.id ASC';
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error listar tareas:', error.message);
        res.status(500).json({ error: 'Error interno al listar tareas' });
    }
};

// Crear tarea POST
const crearTarea = async (req, res) => {
    try {
        const { titulo, descripcion, categoria_id, usuario_id } = req.body;

        // Validar campos requeridos
        if (!titulo || !descripcion) {
            return res.status(400).json({ error: 'Título y descripción son requeridos' });
        }

        // usuario_id es requerido - debe ser el usuario logueado
        if (!usuario_id) {
            return res.status(400).json({ error: 'usuario_id es requerido para crear la tarea' });
        }

        const usuarioIdNum = Number(usuario_id);
        if (Number.isNaN(usuarioIdNum)) {
            return res.status(400).json({ error: 'usuario_id debe ser un número válido' });
        }

        const categoriaIdNum = categoria_id ? Number(categoria_id) : null;
        if (categoria_id && Number.isNaN(categoriaIdNum)) {
            return res.status(400).json({ error: 'categoria_id debe ser un número válido' });
        }

        // Verificar que el usuario existe
        const owner = await getUserById(usuarioIdNum);
        if (!owner) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        // Cualquier usuario logueado puede crear tareas para sí mismo
        // Insertar la tarea con el usuario_id del usuario logueado
        const result = await pool.query(
            'INSERT INTO tareas (titulo, descripcion, categoria_id, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [titulo, descripcion, categoriaIdNum, usuarioIdNum]
        );
        res.status(201).json({ message: 'Tarea creada exitosamente', task: result.rows[0] });
    } catch (error) {
        console.error('Error al crear tarea:', error.message);
        res.status(500).json({ error: 'Error interno al crear tarea' });
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

        const usuarioIdNum = Number(usuario_id);
        if (Number.isNaN(usuarioIdNum)) {
            return res.status(400).json({ error: 'usuario_id debe ser un número válido' });
        }

        const requester = await getUserById(usuarioIdNum);
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
        if (tarea.usuario_id !== usuarioIdNum && !requester.is_admin) {
            return res.status(403).json({ error: 'Solo puedes actualizar tus propias tareas' });
        }

        const categoriaIdNum = categoria_id ? Number(categoria_id) : null;
        if (categoria_id && Number.isNaN(categoriaIdNum)) {
            return res.status(400).json({ error: 'categoria_id debe ser un número válido' });
        }

        const result = await pool.query(
            'UPDATE tareas SET titulo = $1, descripcion=$2, estado=$3, categoria_id=$4 WHERE id =$5 RETURNING *',
            [titulo, descripcion, estado, categoriaIdNum, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        res.json({ message: 'Tarea actualizada exitosamente', task: result.rows[0] });

    } catch (error) {
        console.error('Error actualizar tarea:', error.message);
        res.status(500).json({ error: 'Error interno al actualizar tarea' });
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
      console.error('Error eliminar tarea:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
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