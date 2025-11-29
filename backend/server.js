// server.js
const app = require('./app');
const mongoose = require('mongoose');

/**
 * ĐIỂM KHỞI CHẠY ỨNG DỤNG
 * - Khởi tạo cấu hình và kết nối database
 * - Khởi động server
 */

(async () => {
  try {
    console.log('🚀 Đang khởi động ứng dụng MediAuth...');
    
    // 🔧 LOAD ENVIRONMENT VARIABLES
    require('dotenv').config();
    
    // 📊 CONFIGURATION
    const PORT = process.env.PORT || 5000;
    const NODE_ENV = process.env.NODE_ENV || 'production';
    const DB_URI = process.env.DB_URI;

    console.log('🚀 Đang khởi tạo cấu hình hệ thống...');
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`📊 Database URI: ${DB_URI ? 'Configured' : 'NOT CONFIGURED'}`);

    // 🗄️ KẾT NỐI MONGODB - FIXED
    let dbConnected = false;
    if (DB_URI) {
      try {
        console.log('🔗 Đang kết nối MongoDB...');
        
        // FIX: Remove deprecated options that cause "buffermaxentries is not supported"
        const mongooseOptions = {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 15000, // Tăng timeout
          socketTimeoutMS: 45000,
          // REMOVED: bufferCommands và bufferMaxEntries - gây lỗi
        };

        console.log('📡 Attempting MongoDB connection...');
        await mongoose.connect(DB_URI, mongooseOptions);
        
        dbConnected = true;
        console.log('✅ Kết nối MongoDB thành công');
        console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
        console.log(`🔌 MongoDB State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
        
        // MongoDB event handlers
        mongoose.connection.on('error', (err) => {
          console.error('❌ MongoDB connection error:', err);
          dbConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
          console.log('⚠️ MongoDB disconnected');
          dbConnected = false;
        });

        mongoose.connection.on('connected', () => {
          console.log('✅ MongoDB connected');
          dbConnected = true;
        });

        mongoose.connection.on('reconnected', () => {
          console.log('🔁 MongoDB reconnected');
          dbConnected = true;
        });

      } catch (dbError) {
        console.error('❌ Kết nối MongoDB thất bại:', dbError.message);
        console.log('🔍 Error details:', {
          name: dbError.name,
          code: dbError.code,
          message: dbError.message
        });
        console.log('⚠️ Ứng dụng sẽ chạy không có database connection');
        
        // Log thêm thông tin để debug
        if (dbError.name === 'MongoServerSelectionError') {
          console.log('🔧 Có thể do:');
          console.log('   - MongoDB Atlas Network Access chưa allow IP');
          console.log('   - Database user không có quyền');
          console.log('   - Connection string sai');
        }
      }
    } else {
      console.log('⚠️ Không có DB_URI, bỏ qua kết nối MongoDB');
    }
    
    // 🏥 HEALTH CHECK VERIFICATION
    console.log('🔍 Kiểm tra health endpoint...');
    
    // 🌐 KHỞI ĐỘNG SERVER
    const server = app.listen(PORT, '0.0.0.0', () => {
      const dbStatus = dbConnected ? 'Connected' : 'Disconnected';
      const dbIcon = dbConnected ? '✅' : '❌';
      
      console.log('\n✅ ỨNG DỤNG ĐÃ SẴN SÀNG');
      console.log('=================================');
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`📍 Port: ${PORT}`);
      console.log(`${dbIcon} Database: ${dbStatus}`);
      console.log(`👑 Super Admin: ${process.env.SUPER_ADMIN_EMAIL || 'Not configured'}`);
      console.log('=================================\n');
      
      // Test health endpoint internally
      const testHealth = () => {
        const http = require('http');
        const options = {
          hostname: 'localhost',
          port: PORT,
          path: '/health',
          method: 'GET',
          timeout: 3000
        };
        
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            if (res.statusCode === 200) {
              try {
                const healthData = JSON.parse(data);
                console.log('✅ Health check: PASSED');
                console.log(`   Database status: ${healthData.database || 'unknown'}`);
              } catch (e) {
                console.log('✅ Health check: PASSED (non-JSON response)');
              }
            } else {
              console.log('❌ Health check: FAILED - Status:', res.statusCode);
            }
          });
        });
        
        req.on('error', (err) => {
          console.log('❌ Health check: ERROR -', err.message);
        });
        
        req.on('timeout', () => {
          console.log('❌ Health check: TIMEOUT');
          req.destroy();
        });
        
        req.end();
      };
      
      // Test after 2 seconds to ensure app is fully ready
      setTimeout(testHealth, 2000);
    });

    // 🎯 XỬ LÝ TẮT ỨNG DỤNG GRACEFULLY
    process.on('SIGTERM', async () => {
      console.log('🛑 Nhận tín hiệu SIGTERM, đang tắt server...');
      server.close(async () => {
        if (mongoose.connection.readyState === 1) {
          await mongoose.connection.close(false); // force close
          console.log('✅ MongoDB connection closed');
        }
        console.log('✅ Server đã tắt thành công');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('🛑 Nhận tín hiệu SIGINT, đang tắt server...');
      server.close(async () => {
        if (mongoose.connection.readyState === 1) {
          await mongoose.connection.close(false); // force close
          console.log('✅ MongoDB connection closed');
        }
        console.log('✅ Server đã tắt thành công');
        process.exit(0);
      });
    });

    // 🚨 XỬ LÝ UNHANDLED REJECTION
    process.on('unhandledRejection', (reason, promise) => {
      console.error('🚨 Unhandled Rejection tại:', promise, 'lý do:', reason);
      // Không exit process, chỉ log để app tiếp tục chạy
    });

    // 🚨 XỬ LÝ UNCAUGHT EXCEPTION
    process.on('uncaughtException', (error) => {
      console.error('🚨 Uncaught Exception:', error);
      // Exit process vì ứng dụng ở trạng thái không ổn định
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Khởi động server thất bại:', error);
    console.error('🔍 Error stack:', error.stack);
    process.exit(1);
  }
})();