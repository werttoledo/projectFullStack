-- init_db.sql
-- Ejecutar con psql como superusuario (postgres) para crear role, BD y tabla

-- 1) Crear rol (usuario) admin con contraseña 12345
CREATE ROLE admin WITH LOGIN PASSWORD '12345';

-- 2) Crear la base de datos taskhub y asignar propietario
CREATE DATABASE taskhub OWNER admin;

-- Nota: a partir de aquí, si ejecutas este archivo con psql, usa \c taskhub para conectarte
\c taskhub

-- 3) Crear la tabla tareas
CREATE TABLE IF NOT EXISTS tareas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4) Opcional: dar privilegios
GRANT ALL PRIVILEGES ON DATABASE taskhub TO admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
