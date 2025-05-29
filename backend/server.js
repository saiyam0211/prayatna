require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Security middleware
app.use(helmet());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// MongoDB connection with singleton pattern
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('📊 Using existing MongoDB connection');
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://saiyamkumar2007:Saiyam12@cluster0.x9jcmnx.mongodb.net/prayatna';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    isConnected = true;
    console.log('✅ MongoDB Atlas connected successfully');
    
    // Monitor connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      isConnected = false;
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      isConnected = true;
    });
    
    // Verify Twilio configuration
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      console.log('✅ Twilio configuration found');
    } else {
      console.log('⚠️  Twilio configuration missing - OTP features will not work');
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    isConnected = false;
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Import routes with error handling
const importRoutes = () => {
  try {
    const authRoutes = require('./routes/auth');
    const schoolRoutes = require('./routes/school');
    const studentRoutes = require('./routes/student');
    const teacherRoutes = require('./routes/teacher');
    const postRoutes = require('./routes/posts');
    const aiRoutes = require('./routes/ai');

    // API routes
    app.use('/api/auth', authRoutes);
    app.use('/api/school', schoolRoutes);
    app.use('/api/student', studentRoutes);
    app.use('/api/teacher', teacherRoutes);
    app.use('/api/posts', postRoutes);
    app.use('/api/ai', aiRoutes);
    
    console.log('✅ All routes loaded successfully');
  } catch (error) {
    console.error('❌ Error loading routes:', error);
    process.exit(1);
  }
};

// Load routes
importRoutes();

// Health check endpoint with detailed status
app.get('/api/health', async (req, res) => {
  const healthStatus = {
    success: true,
    message: 'Prayatna Backend Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      twilio: process.env.TWILIO_ACCOUNT_SID ? 'configured' : 'not configured'
    },
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version
  };
  
  // Set appropriate HTTP status based on service health
  const statusCode = healthStatus.services.database === 'connected' ? 200 : 503;
  res.status(statusCode).json(healthStatus);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Prayatna Backend API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      auth: '/api/auth',
      school: '/api/school',
      student: '/api/student',
      teacher: '/api/teacher',
      posts: '/api/posts',
      ai: '/api/ai'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
    availableEndpoints: ['/api/health', '/api/auth', '/api/school', '/api/student', '/api/teacher', '/api/posts', '/api/ai']
  });
});

// Global error handler with enhanced error handling
app.use((error, req, res, next) => {
  console.error('Global error handler:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors,
      type: 'validation'
    });
  }
  
  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || 'field';
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
      type: 'duplicate'
    });
  }
  
  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      type: 'auth'
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      type: 'auth'
    });
  }
  
  // MongoDB connection errors
  if (error.name === 'MongoError' || error.name === 'MongoNetworkError') {
    return res.status(503).json({
      success: false,
      message: 'Database connection error',
      type: 'database'
    });
  }
  
  // Default error
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    type: 'server',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown with cleanup
const gracefulShutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  
  // Stop accepting new connections
  const server = app.listen(PORT);
  server.close(() => {
    console.log('HTTP server closed.');
    
    // Close database connection
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

const PORT = process.env.PORT || 3001;

// Start server with error handling
const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Prayatna Backend Server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔗 API Documentation: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Only start server if this file is run directly (not imported)
if (require.main === module) {
  startServer();
}

module.exports = app;