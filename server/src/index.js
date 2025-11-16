import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { setupPledgeSocket } from './sockets/pledgeSocket.js';

// Routes
import authRoutes from './routes/auth.js';
import carbonRoutes from './routes/carbon.js';
import pledgeRoutes from './routes/pledge.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true
  }
});

setupPledgeSocket(io);

// Middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', status: 'OK' });
});

app.use('/api/auth', authRoutes);
app.use('/api/carbon', carbonRoutes);
app.use('/api/pledge', pledgeRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  import('path').then(({ default: path }) => {
    import('url').then(({ fileURLToPath }) => {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const clientDistPath = path.join(__dirname, '../../client/dist');
      
      app.use(express.static(clientDistPath));
      
      app.get('*', (req, res) => {
        res.sendFile(path.join(clientDistPath, 'index.html'));
      });
    });
  });
}

// Error handling
app.use(notFound);
app.use(errorHandler);

// Make io available to routes
app.set('io', io);

const START_PORT = parseInt(process.env.PORT, 10) || 5000;

const tryListen = (port) => {
  httpServer.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} in use, trying ${port + 1}...`);
      tryListen(port + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  httpServer.once('listening', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
  });

  httpServer.listen(port);
};

tryListen(START_PORT);

export { io };

