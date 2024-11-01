import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import { dynamicRateLimiter } from './middleware/rateLimiter.js';
import apiRoutes from './routes/api.js';
import healthRoutes from './routes/health.js';
import { handleError } from './utils/errorHandler.js';
import { initializeFeatureTiers } from './controllers/subscriptionController.js';
import validateEnv from './utils/validateEnv.js';
import logger from './utils/logger.js';

// Load and validate environment variables
dotenv.config();
const env = validateEnv();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true
}));
app.use(compression());

// Rate limiting
app.use('/api', dynamicRateLimiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);
app.use('/', healthRoutes);

// Error handling middleware
app.use(handleError);

// Database connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Connected to MongoDB');
    
    // Initialize feature tiers after successful connection
    await initializeFeatureTiers();
    logger.info('Feature tiers initialized');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    setTimeout(connectDB, 5000);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected! Attempting to reconnect...');
  connectDB();
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB error:', err);
});

// Initial database connection
connectDB();

// Start server
const PORT = env.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

export { app };