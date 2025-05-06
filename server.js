// This file is kept for potential server configuration or future use
const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./services/socketService');

const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

module.exports = { app, server, io };
