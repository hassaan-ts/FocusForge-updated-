import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/health', async (req, res) => {
  const status = {
    timestamp: new Date(),
    service: 'FocusForge API',
    status: 'ok',
    details: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    }
  };

  const isHealthy = status.details.database === 'connected';
  
  res.status(isHealthy ? 200 : 503).json(status);
});

router.get('/health/db', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ status: 'ok', message: 'Database connection is healthy' });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      message: 'Database connection issue',
      error: error.message 
    });
  }
});

export default router;