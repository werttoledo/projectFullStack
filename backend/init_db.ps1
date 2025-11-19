# init_db.ps1
# Script PowerShell para ejecutar init_db.sql usando psql (Windows)
# Asegúrate de tener psql en el PATH o ajusta la ruta completa al ejecutable psql.exe

$psql = "psql"
$script = "init_db.sql"

Write-Host "Ejecutando script SQL: $script"

try {
    & $psql -U postgres -h localhost -p 5432 -f $script
} catch {
    Write-Host "Error al ejecutar psql. Asegúrate de que psql esté instalado y en el PATH."
    Write-Host "Si psql no está en PATH, reemplaza la variable`$psql` con la ruta completa, por ejemplo:`"C:\Program Files\PostgreSQL\14\bin\psql.exe"`"
}

Write-Host "Si psql pidió contraseña, introdúcela (usuario postgres). El script creará el role 'admin' y la DB 'taskhub'."