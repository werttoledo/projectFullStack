const pool = require('../config/db');

const listarCategorias = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearCategoria = async (req, res) => {
  try {
    const { nombre, color } = req.body;
    const requester_id = req.body.requester_id || req.query.requester_id;
    if (!nombre) return res.status(400).json({ error: 'nombre es requerido' });
    if (!requester_id) return res.status(400).json({ error: 'requester_id es requerido' });
    // Verificar que requester es admin
    const userRes = await pool.query('SELECT is_admin FROM usuarios WHERE id = $1', [requester_id]);
    if (userRes.rowCount === 0) return res.status(400).json({ error: 'Usuario requester no encontrado' });
    if (!userRes.rows[0].is_admin) return res.status(403).json({ error: 'Solo administradores pueden crear categorías' });
    const result = await pool.query(
      'INSERT INTO categorias (nombre, color) VALUES ($1, $2) RETURNING *',
      [nombre, color || null]
    );
    res.status(201).json({ message: 'Categoria creada', categoria: result.rows[0] });
  } catch (error) {
    console.error('Error crear categoria:', error);
    res.status(500).json({ error: error.message });
  }
};

const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    // Para DELETE, el requester_id viene en query params
    const requester_id = req.query?.requester_id || req.body?.requester_id;
    
    if (!requester_id) {
      return res.status(400).json({ error: 'requester_id es requerido' });
    }
    
    // Convertir a número si es string
    const requesterIdNum = Number(requester_id);
    if (isNaN(requesterIdNum)) {
      return res.status(400).json({ error: 'requester_id debe ser un número válido' });
    }
    
    // Verificar que requester es admin
    const userRes = await pool.query('SELECT is_admin FROM usuarios WHERE id = $1', [requesterIdNum]);
    if (userRes.rowCount === 0) {
      return res.status(400).json({ error: 'Usuario requester no encontrado' });
    }
    if (!userRes.rows[0].is_admin) {
      return res.status(403).json({ error: 'Solo administradores pueden eliminar categorías' });
    }
    
    // Verificar que la categoría existe
    const categoriaRes = await pool.query('SELECT id FROM categorias WHERE id = $1', [id]);
    if (categoriaRes.rowCount === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    
    // Eliminar la categoría
    await pool.query('DELETE FROM categorias WHERE id = $1', [id]);
    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminar categoria:', error);
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
};

module.exports = { listarCategorias, crearCategoria, eliminarCategoria };