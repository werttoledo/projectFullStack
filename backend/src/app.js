const express = require('express');
require('dotenv').config();
const pool = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 4000;



app.use(express.json());

// Rutas Raiz
app.get('/', (req, res) => {
    res.send("Servidor Node.js + Express + PostgreSQL");
});


//1. Importar el enrutador de usuarios
const rutas = require('./src/routes/index');


//2. Usar el enrutador de usuarios con el prefijo /api/users
app.use('/api', rutas);

//3.App listen en el puerto definido
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));

