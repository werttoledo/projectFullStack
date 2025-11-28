-- add_usuario_id_to_categorias.sql
-- Agrega columna usuario_id a la tabla categorias para que cada usuario tenga sus propias categorías
-- Ejecutar: psql -U admin -h localhost -d taskhub -f add_usuario_id_to_categorias.sql

-- Añadir columna usuario_id si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='categorias' AND column_name='usuario_id'
  ) THEN
    ALTER TABLE categorias ADD COLUMN usuario_id INTEGER REFERENCES usuarios(id);
  END IF;
END$$;

-- Eliminar la restricción UNIQUE del nombre si existe (para permitir nombres duplicados entre usuarios)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'categorias_nombre_key'
  ) THEN
    ALTER TABLE categorias DROP CONSTRAINT categorias_nombre_key;
  END IF;
END$$;

-- Crear índice único compuesto para nombre + usuario_id (cada usuario puede tener categorías con el mismo nombre)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'categorias_nombre_usuario_unique'
  ) THEN
    CREATE UNIQUE INDEX categorias_nombre_usuario_unique ON categorias(nombre, usuario_id);
  END IF;
END$$;

-- Asignar categorías existentes al primer usuario admin (si existen categorías sin usuario_id)
UPDATE categorias 
SET usuario_id = (SELECT id FROM usuarios WHERE is_admin = true LIMIT 1)
WHERE usuario_id IS NULL;

SELECT 'Columna usuario_id agregada a categorias exitosamente';

