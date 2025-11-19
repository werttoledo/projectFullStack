-- setup_db_idempotent.sql
-- Script SQL que NO falla si el role o BD ya existen

-- 1) Crear o alterar el rol admin
DO $$ BEGIN
  CREATE ROLE admin WITH LOGIN PASSWORD '12345';
EXCEPTION WHEN duplicate_object THEN
  ALTER ROLE admin WITH PASSWORD '12345';
END $$;

-- 2) Crear la base de datos taskhub
DO $$ BEGIN
  CREATE DATABASE taskhub OWNER admin;
EXCEPTION WHEN duplicate_database THEN
  NULL;
END $$;

-- Nota: El archivo se ejecuta como superusuario (postgres) pero la BD se crea con owner admin.
-- Los comandos siguientes deben ejecutarse conectados a la BD taskhub.
-- Por ello, te recomendamos ejecutar esto en psql interactivo O usar otro script después.
