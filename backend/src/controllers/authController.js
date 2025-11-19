const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Login con bcrypt
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validar que se envíen email y password
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario por email
    const result = await pool.query(
      'SELECT id, nombre, email, password, is_admin FROM usuarios WHERE email = $1', 
      [email]
    );
    
    if (result.rowCount === 0) {
      return res.status(401).json({ 
        success: false,
        error: 'Credenciales inválidas. Usuario no encontrado.' 
      });
    }

    const user = result.rows[0];
    
    // Verificar contraseña con bcrypt
    // Si la contraseña en la BD no está hasheada (es texto plano), comparamos directamente
    // Esto es para compatibilidad con datos existentes
    let passwordMatch = false;
    
    // Intentar comparar con bcrypt primero (si está hasheada)
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$') || user.password.startsWith('$2y$')) {
      passwordMatch = await bcrypt.compare(password, user.password);
    } else {
      // Si no está hasheada, comparar directamente (para compatibilidad)
      passwordMatch = user.password === password;
    }
    
    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false,
        error: 'Credenciales inválidas. Contraseña incorrecta.' 
      });
    }

    // Login exitoso - retornar formato requerido
    res.json({ 
      success: true,
      userId: user.id,
      nombre: user.nombre,
      email: user.email,
      isAdmin: user.is_admin || false
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Error interno del servidor' 
    });
  }
};

const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await pool.query('SELECT 1 FROM usuarios WHERE email = $1', [normalizedEmail]);
    if (existing.rowCount > 0) {
      return res.status(409).json({
        success: false,
        error: 'El email ya está registrado'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email, is_admin',
      [nombre || null, normalizedEmail, hashedPassword]
    );

    res.status(201).json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error en registro:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error interno al registrar usuario'
    });
  }
};

module.exports = { login, register };