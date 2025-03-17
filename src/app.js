require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
connectDB();
app.use(express.json());
app.use(cookieParser());
app.disable('X-Powered-By');

app.use((req, res, next) => {
  // Obtenemos el token de las cookies del navegador
  const token = req.cookies.access_token;

  // Ponemos la sesión del usuario como nula
  req.session = { user: null }

  try {
    // Comparamos el token recibido con nuestro codigo secreto en .env
    // Esto sirve para extraer los datos enviados a traves del token (_id, user) se puede modificar en /loginAuth
    // Guardamos en la sesión del usuario lo datos extraidos
    const data= jwt.verify(token, process.env.JWT_SECRET);
    req.session.user = data;
  } catch {} // Si no hay token, la sesión del usuario continua como null
  next()
});

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:8081'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};
app.use(cors(corsOptions));

const routes = require('./routes');
app.use('/api', routes);

module.exports = app;
