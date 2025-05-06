const socketIo = require('socket.io');

let io;

// Emit event to specific parent room
const emitToParent = (parentId, event, data) => {
  if (io) {
    io.to(`parent:${parentId}`).emit(event, data);
  }
};

// Emit event to admin room
const emitToAdmin = (event, data) => {
  if (io) {
    io.to('admin').emit(event, data);
  }
};

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
      methods: ["GET", "POST", "PATCH"],
      allowedHeaders: ["Authorization"],
      credentials: true
    },
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Detailed logging for connection events
    socket.on('connect', () => {
      console.log(`Socket connected: ${socket.id}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.id}. Reason: ${reason}`);
    });

    socket.on('error', (error) => {
      console.error(`Socket error: ${socket.id}`, error);
    });

    // Join room based on role and ID
    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });
  });

  return io;
};

module.exports = {
  initializeSocket,
  emitToParent,
  emitToAdmin,
  io
};
// const emitToAdmin = (event, data) => {
//   if (io) {
//     io.to('adminRoom').emit(event, data);
//   }
// };

module.exports = {
  initializeSocket,
  emitToParent,
  emitToAdmin
};
