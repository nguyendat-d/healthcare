// src/services/audit.service.js
const AuditLog = require('../models/auditLog.model');

/**
 * DỊCH VỤ GHI NHẬT KÝ KIỂM TRA (AUDIT LOG)
 * - Ghi lại tất cả hành động quan trọng trong hệ thống
 * - Không làm gián đoạn luồng chính khi ghi log thất bại
 * 
 * @param {string|null} actor - ID người thực hiện hành động (null cho unauthenticated)
 * @param {string} action - Loại hành động (ví dụ: 'LOGIN', 'CREATE_USER')
 * @param {Object} options - Các tùy chọn bổ sung
 * @param {string} options.target - ID đối tượng bị tác động
 * @param {string} options.ip - Địa chỉ IP
 * @param {string} options.userAgent - Thông tin user agent
 * @param {Object} options.meta - Thông tin bổ sung dạng object
 * @returns {Promise<void>}
 */
async function log(actor, action, options = {}) {
  try {
    const { target = null, ip = null, userAgent = null, meta = {} } = options;
    
    await AuditLog.create({
      actor: actor || null,
      action,
      target,
      ip,
      userAgent,
      meta
    });
    
    // 🔹 LOG THÀNH CÔNG (chỉ trong development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`📝 Audit Log: ${action} by ${actor || 'SYSTEM'}`);
    }
  } catch (err) {
    // 🔴 KHÔNG LÀM GIÁN ĐOẠN ỨNG DỤNG KHI GHI LOG THẤT BẠI
    console.error('❌ Lỗi ghi audit log:', err.message);
    // Có thể tích hợp với service log bên ngoài (Sentry, LogRocket, etc.)
  }
}

module.exports = { log };