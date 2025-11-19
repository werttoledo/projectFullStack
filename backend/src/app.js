const express = require('express');
require('dotenv').config();
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// Rutas Raiz
app.get('/', (req, res) => {
    res.send("Servidor Node.js + Express + PostgreSQL");
});


//1. Importar el enrutador de usuarios
const rutas = require('./routes/index');


//2. Usar el enrutador de usuarios con el prefijo /api/users
app.use('/api', rutas);

//3.App listen en el puerto definido
app.listen(PORT);

