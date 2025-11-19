-- setup_simple.sql
-- Script simple para crear role y BD (sin bloques de transacción)
-- Ejecutar como: psql -U postgres -h localhost -p 5432 -f setup_simple.sql

-- 1) Crear rol admin (si falla porque existe, ignora)
CREATE ROLE admin WITH LOGIN PASSWORD '12345';

-- 2) Crear la base de datos taskhub
CREATE DATABASE taskhub OWNER admin;
