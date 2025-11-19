-- setup_schema_extended.sql
-- Crea tablas categorias y usuarios, y añade columnas categoria_id y usuario_id a tareas (idempotente)
-- Ejecutar: psql -U admin -h localhost -d taskhub -f setup_schema_extended.sql

-- Tabla categorias
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(20) DEFAULT '#ffffff'
);

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Añadir columna categoria_id si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='tareas' AND column_name='categoria_id'
  ) THEN
    ALTER TABLE tareas ADD COLUMN categoria_id INTEGER REFERENCES categorias(id);
  END IF;
END$$;

-- Añadir columna usuario_id si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='tareas' AND column_name='usuario_id'
  ) THEN
    ALTER TABLE tareas ADD COLUMN usuario_id INTEGER REFERENCES usuarios(id);
  END IF;
END$$;

-- Mensaje de confirmación
SELECT 'Esquema extendido aplicado (categorias, usuarios, columnas en tareas)';

-- Insertar usuario de prueba si no existe (email: test@local, password: 12345)
INSERT INTO usuarios (nombre, email, password)
SELECT 'Usuario de prueba', 'test@local', '12345'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'test@local');

-- Insertar categorías base si no existen
INSERT INTO categorias (nombre, color)
SELECT 'Estudio', '#FFF9C4'
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre = 'Estudio');

INSERT INTO categorias (nombre, color)
SELECT 'Trabajo', '#DCEDC8'
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre = 'Trabajo');

INSERT INTO categorias (nombre, color)
SELECT 'Hobby', '#BBDEFB'
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre = 'Hobby');

-- Añadir columna is_admin a usuarios si no existe (default false)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='usuarios' AND column_name='is_admin'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN is_admin BOOLEAN DEFAULT false;
  END IF;
END$$;

-- Marcar usuario de prueba como admin
UPDATE usuarios SET is_admin = true WHERE email = 'test@local';
