const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

module.exports = {
  init: (server) => {
    io = socketIo(server, {
      cors: {
        origin: function (origin, callback) {
          const allowedOrigins = [process.env.FRONTEND_URL];
          if (!origin || origin.startsWith('http://localhost:') || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true,
      }
    });

    // Authentication Middleware for sockets
    io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; // Attach user payload to socket
        next();
      } catch (err) {
        next(new Error('Authentication error'));
      }
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id, 'User ID:', socket.user.id);
      
      // Join a room based on user role and user id for targeted notifications
      socket.join(socket.user.id);
      if (socket.user.role) {
        socket.join(`role:${socket.user.role}`);
      }

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
