import './types'; // Load type extensions
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { verifyToken } from './config/jwt';

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.io authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = verifyToken(token);
    (socket as any).userId = decoded.userId;
    (socket as any).role = decoded.role;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.io connection handler
io.on('connection', (socket) => {
  const userId = (socket as any).userId;
  const role = (socket as any).role;

  console.log(`User ${userId} connected (role: ${role})`);

  // Join room based on role
  if (role === 'student') {
    socket.join(`student-${userId}`);
  } else if (role === 'employee' || role === 'admin') {
    socket.join('employees');
  }

  // Listen for order events
  socket.on('order:created', (order) => {
    // Emit to employees
    io.to('employees').emit('order:created', order);
  });

  socket.on('order:updated', (order) => {
    // Emit to student who owns the order
    io.to(`student-${order.student}`).emit('order:updated', order);
  });

  socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected`);
  });
});

// Export io for use in controllers
export { io };

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start HTTP server
    server.listen(env.PORT, () => {
      console.log(`✅ Server running on port ${env.PORT}`);
      console.log(`📍 Environment: ${env.NODE_ENV}`);
      console.log(`🌐 Client URL: ${env.CLIENT_URL}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

