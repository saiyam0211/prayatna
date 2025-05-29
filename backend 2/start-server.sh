#!/bin/bash

# Prayatna Backend Server Startup Script
echo "🚀 Starting Prayatna Backend Server..."

export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/prayatna"
export JWT_SECRET="your-jwt-secret-key-here"
export PORT=3001
export NODE_ENV=development

# Twilio Configuration (Replace with your actual values)
export TWILIO_ACCOUNT_SID="your_twilio_account_sid_here"
export TWILIO_AUTH_TOKEN="your_twilio_auth_token_here"
export TWILIO_PHONE_NUMBER="+1234567890"
export TWILIO_VERIFY_SERVICE_SID="your_twilio_verify_service_sid_here"

# Default School Credentials
export DEFAULT_SCHOOL_ID="PRAYATNA2024"
export DEFAULT_SCHOOL_PASSWORD="admin123"

# Frontend URL
export FRONTEND_URL="http://localhost:5173"

# Rate Limiting
export RATE_LIMIT_WINDOW_MS=900000
export RATE_LIMIT_MAX_REQUESTS=100

# Content Moderation
export CONTENT_MODERATION_ENABLED=true
export AUTO_APPROVE_TEACHER_POSTS=true

echo "✅ Environment variables set"
echo "📱 Starting server on port $PORT..."

node server.js 