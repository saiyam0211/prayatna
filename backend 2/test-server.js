const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Simple test server to verify dependencies and basic setup
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Prayatna Backend is working!',
    timestamp: new Date().toISOString(),
    dependencies: {
      express: 'OK',
      cors: 'OK',
      helmet: 'OK',
      bcryptjs: require('bcryptjs') ? 'OK' : 'MISSING',
      mongoose: require('mongoose') ? 'OK' : 'MISSING',
      jsonwebtoken: require('jsonwebtoken') ? 'OK' : 'MISSING',
      multer: require('multer') ? 'OK' : 'MISSING',
      sharp: require('sharp') ? 'OK' : 'MISSING'
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`📍 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`🚀 All major dependencies loaded successfully`);
});

module.exports = app; 