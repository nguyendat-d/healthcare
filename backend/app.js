// src/app.js
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const { appConfig } = require('./src/config');
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const patientRoutes = require('./src/routes/patient.routes');
const appointmentRoutes = require('./src/routes/appointment.routes');
const medicalRoutes = require('./src/routes/medical.routes');
const prescriptionRoutes = require('./src/routes/prescription.routes');
const labRoutes = require('./src/routes/lab.routes');
const billingRoutes = require('./src/routes/billing.routes');
const consultationRoutes = require('./src/routes/consultation.routes');
const superAdminRoutes = require('./src/routes/superAdmin.routes');
const webhookRoutes = require('./src/routes/webhook.routes');

/**
 * ỨNG DỤNG EXPRESS CHÍNH
 * - Cấu hình middleware bảo mật và hiệu năng
 * - Định tuyến API endpoints
 */

// 🚀 KHỞI TẠO ỨNG DỤNG EXPRESS
const app = express();

// 🔒 MIDDLEWARE BẢO MẬT
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Tắt CSP để tránh lỗi trên production
}));

// 🌐 CORS CONFIGURATION - FIXED FOR PRODUCTION
app.use(cors({
  origin: function(origin, callback) {
    // Cho phép requests không có origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Cho production, allow tất cả origins hoặc config cụ thể
    const allowedOrigins = [
      '*', // Cho phép tất cả trong production
      'http://localhost:5173',
      'http://localhost:3000',
      'https://your-frontend-domain.com' // Thay bằng domain thực tế
    ];
    
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Log và reject
    console.log(`🚫 CORS blocked: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ⚡ MIDDLEWARE HIỆU NĂNG
app.use(compression()); // Nén response
app.use(express.json({ limit: '10mb' })); // Giới hạn kích thước request
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 📊 LOGGING MIDDLEWARE
// Sửa lỗi appConfig có thể undefined
const logFormat = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
app.use(morgan(logFormat, {
  skip: (req) => req.path === '/health' // Bỏ log health check
}));

// 🛡️ RATE LIMITING CHO API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // Giới hạn request
  message: {
    error: 'Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// 🏥 HEALTH CHECK ENDPOINT - ĐẢM BẢO LUÔN HOẠT ĐỘNG
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected', 
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production',
    version: process.env.npm_package_version || '1.0.0',
    database: dbStates[dbState],
    databaseCode: dbState,
    memory: process.memoryUsage(),
    nodeVersion: process.version
  });
});

// 🧪 TEST ENDPOINTS - THÊM PHẦN NÀY
app.get('/api/test-db', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    
    const states = {
      0: 'disconnected',
      1: 'connected', 
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      success: true,
      dbState: states[dbState],
      dbStateCode: dbState,
      environment: process.env.NODE_ENV,
      dbUri: process.env.DB_URI ? 'Configured' : 'Not configured',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
      dbState: 'error'
    });
  }
});

app.get('/api/test-env', (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    dbUriConfigured: !!process.env.DB_URI,
    corsOrigin: process.env.CORS_ORIGIN,
    // Ẩn các biến nhạy cảm
    jwtSecret: process.env.JWT_SECRET ? 'Configured' : 'Not configured',
    superAdmin: process.env.SUPER_ADMIN_EMAIL || 'Not configured'
  });
});

// 🎯 API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/webhook', webhookRoutes);

// 🏠 ROOT ENDPOINT
app.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    message: '🩺 Healthcare Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    database: dbStatus,
    endpoints: {
      health: '/health',
      testDb: '/api/test-db',
      testEnv: '/api/test-env',
      auth: '/api/auth',
      users: '/api/users',
      docs: '/api/docs'
    }
  });
});

// 🔍 DEBUG ENDPOINT (chỉ trong development)
if (process.env.NODE_ENV === 'development') {
  app.get('/api/debug/config', (req, res) => {
    res.json({
      environment: process.env.NODE_ENV,
      port: process.env.PORT,
      nodeEnv: process.env.NODE_ENV,
      corsOrigin: process.env.CORS_ORIGIN
    });
  });
}

// ❌ HANDLE 404 - KHÔNG TÌM THẤY ROUTE
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Không tìm thấy endpoint',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// 🚨 ERROR HANDLING MIDDLEWARE
app.use((error, req, res, next) => {
  console.error('🚨 Lỗi hệ thống:', error);

  // 🎯 PHÂN LOẠI LỖI
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Dữ liệu không hợp lệ',
      details: error.details?.map(detail => detail.message) || [error.message]
    });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token không hợp lệ'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token đã hết hạn'
    });
  }

  // MongoDB errors
  if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
    return res.status(503).json({
      error: 'Database connection error',
      details: 'Cannot connect to MongoDB database'
    });
  }

  if (error.name === 'MongoServerError') {
    return res.status(500).json({
      error: 'Database error',
      details: 'Internal database error occurred'
    });
  }

  // 🎯 LỖI MẶC ĐỊNH
  const statusCode = error.statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';
  const message = isDev ? error.message : 'Đã xảy ra lỗi hệ thống';

  res.status(statusCode).json({
    error: message,
    ...(isDev && { 
      stack: error.stack,
      details: error.toString()
    })
  });
});

module.exports = app;