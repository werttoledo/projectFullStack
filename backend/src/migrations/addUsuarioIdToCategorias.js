// Migración: Agregar usuario_id a categorias
// Este script se ejecuta automáticamente al iniciar el servidor si la columna no existe

const pool = require('../config/db');

async function addUsuarioIdToCategorias() {
  try {
    // Verificar si la columna ya existe
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='categorias' AND column_name='usuario_id'
    `);

    if (checkColumn.rows.length > 0) {
      console.log('✓ Columna usuario_id ya existe en categorias');
      return;
    }

    console.log('🔄 Agregando columna usuario_id a categorias...');

    // Agregar columna usuario_id
    await pool.query(`
      ALTER TABLE categorias 
      ADD COLUMN usuario_id INTEGER REFERENCES usuarios(id)
    `);

    // Eliminar la restricción UNIQUE del nombre si existe
    try {
      await pool.query(`ALTER TABLE categorias DROP CONSTRAINT IF EXISTS categorias_nombre_key`);
    } catch (err) {
      // Ignorar si no existe
    }

    // Crear índice único compuesto para nombre + usuario_id
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS categorias_nombre_usuario_unique 
      ON categorias(nombre, usuario_id)
    `);

    // Asignar categorías existentes al primer usuario admin
    await pool.query(`
      UPDATE categorias 
      SET usuario_id = (SELECT id FROM usuarios WHERE is_admin = true LIMIT 1)
      WHERE usuario_id IS NULL
    `);

    console.log('✓ Columna usuario_id agregada exitosamente a categorias');
  } catch (error) {
    console.error('❌ Error al agregar usuario_id a categorias:', error.message);
    throw error;
  }
}

module.exports = addUsuarioIdToCategorias;

