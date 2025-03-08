require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
connectDB();
app.use(express.json());
app.disable('X-Powered-By');

const routes = require('./routes');
app.use('/api', routes);

module.exports = app;