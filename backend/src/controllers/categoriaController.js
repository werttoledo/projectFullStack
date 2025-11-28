const pool = require('../config/db');

const listarCategorias = async (req, res) => {
  try {
    const { usuario_id } = req.query;
    
    if (!usuario_id) {
      return res.status(400).json({ error: 'usuario_id es requerido para listar categorías' });
    }
    
    const usuarioIdNum = Number(usuario_id);
    if (Number.isNaN(usuarioIdNum)) {
      return res.status(400).json({ error: 'usuario_id debe ser un número válido' });
    }
    
    // Verificar que el usuario existe
    const userRes = await pool.query('SELECT id FROM usuarios WHERE id = $1', [usuarioIdNum]);
    if (userRes.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Listar solo las categorías del usuario
    const result = await pool.query(
      'SELECT * FROM categorias WHERE usuario_id = $1 ORDER BY id ASC',
      [usuarioIdNum]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error listar categorias:', error.message);
    // Si el error es que la columna no existe, dar un mensaje más claro
    if (error.message && error.message.includes('column') && error.message.includes('usuario_id')) {
      return res.status(500).json({ 
        error: 'La columna usuario_id no existe en la tabla categorias. Ejecuta el script SQL: backend/add_usuario_id_to_categorias.sql' 
      });
    }
    res.status(500).json({ error: 'Error interno al listar categorías: ' + error.message });
  }
};

const crearCategoria = async (req, res) => {
  try {
    const { nombre, color, usuario_id } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ error: 'nombre es requerido' });
    }
    
    if (!usuario_id) {
      return res.status(400).json({ error: 'usuario_id es requerido para crear categoría' });
    }
    
    const usuarioIdNum = Number(usuario_id);
    if (Number.isNaN(usuarioIdNum)) {
      return res.status(400).json({ error: 'usuario_id debe ser un número válido' });
    }
    
    // Verificar que el usuario existe
    const userRes = await pool.query('SELECT id FROM usuarios WHERE id = $1', [usuarioIdNum]);
    if (userRes.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Cualquier usuario autenticado puede crear categorías para sí mismo
    const result = await pool.query(
      'INSERT INTO categorias (nombre, color, usuario_id) VALUES ($1, $2, $3) RETURNING *',
      [nombre, color || null, usuarioIdNum]
    );
    res.status(201).json({ message: 'Categoría creada exitosamente', categoria: result.rows[0] });
  } catch (error) {
    // Si es error de constraint único, significa que ya existe una categoría con ese nombre para ese usuario
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ya existe una categoría con ese nombre para este usuario' });
    }
    console.error('Error crear categoria:', error.message);
    // Si el error es que la columna no existe, dar un mensaje más claro
    if (error.message && error.message.includes('column') && error.message.includes('usuario_id')) {
      return res.status(500).json({ 
        error: 'La columna usuario_id no existe en la tabla categorias. Ejecuta el script SQL: backend/add_usuario_id_to_categorias.sql' 
      });
    }
    res.status(500).json({ error: 'Error interno al crear categoría: ' + error.message });
  }
};

const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.query?.usuario_id || req.body?.usuario_id;
    
    if (!usuario_id) {
      return res.status(400).json({ error: 'usuario_id es requerido' });
    }
    
    const usuarioIdNum = Number(usuario_id);
    if (Number.isNaN(usuarioIdNum)) {
      return res.status(400).json({ error: 'usuario_id debe ser un número válido' });
    }
    
    // Verificar que el usuario existe
    const userRes = await pool.query('SELECT id FROM usuarios WHERE id = $1', [usuarioIdNum]);
    if (userRes.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Verificar que la categoría existe y pertenece al usuario
    const categoriaRes = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
    if (categoriaRes.rowCount === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    
    const categoria = categoriaRes.rows[0];
    
    // Solo el dueño de la categoría puede eliminarla
    if (categoria.usuario_id !== usuarioIdNum) {
      return res.status(403).json({ error: 'Solo puedes eliminar tus propias categorías' });
    }
    
    // Eliminar la categoría
    await pool.query('DELETE FROM categorias WHERE id = $1', [id]);
    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminar categoria:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { listarCategorias, crearCategoria, eliminarCategoria };