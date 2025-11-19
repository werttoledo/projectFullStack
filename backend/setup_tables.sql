-- setup_tables.sql
-- Script para crear la tabla tareas en la BD taskhub
-- Ejecutar como: psql -U admin -h localhost -d taskhub -f setup_tables.sql
-- (Te pedirá la contraseña: 12345)

CREATE TABLE IF NOT EXISTS tareas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dar privilegios (por si acaso)
GRANT ALL PRIVILEGES ON DATABASE taskhub TO admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;

-- Confirmar
SELECT 'Tabla tareas creada/verificada' AS resultado;
