require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const setupMQTTConnection = require('./config/mqttConfig');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:8081'],
    methods: ['GET', 'POST']
  }
});

connectDB();
app.use(express.json());
app.use(cookieParser());
app.disable('X-Powered-By');

// MQTT Connection
const mqttClient = setupMQTTConnection();

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// JWT middleware
app.use((req, res, next) => {
  const token = req.cookies.access_token;
  req.session = { user: null }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.session.user = data;
  } catch {} 
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

// Export server instead of app to include Socket.IO
module.exports = { server, io, mqttClient };