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
app.use(express.json());
app.use(cookieParser());
app.disable('X-Powered-By');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST']
  }
});

connectDB();

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
  let token = req.cookies?.access_token;

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }
  
  req.session = { user: null }

  if (!token) {
    return next();
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.session.user = data;
  } catch (error){
  }
  next()
});

const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

const routes = require('./routes');
const { invalid } = require('moment');
app.use('/api', routes);

// Export server instead of app to include Socket.IO
module.exports = { server, io, mqttClient };