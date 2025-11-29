// src/services/auth.service.js
const ms = require('ms');
const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const { hashPassword, comparePassword, randomTokenHex, sha256 } = require('../utils/hash');
const { signAccessToken } = require('../utils/jwt');
const { appConfig } = require('../config');
const { log } = require('./audit.service');
const Patient = require('../models/patient.model');
const speakeasy = require('speakeasy');
const { getRefreshExpiryMs } = require('../config/jwt.config');
const { ROLES, ROLE_PERMISSIONS } = require('../constants/roles');

/**
 * DỊCH VỤ XÁC THỰC & QUẢN LÝ NGƯỜI DÙNG
 * - Xử lý logic đăng ký, đăng nhập, quản lý token
 * - Hỗ trợ xác thực 2 yếu tố (2FA)
 */

/**
 * TẠO REFRESH TOKEN MỚI CHO USER
 * 
 * @param {string} userId - ID người dùng
 * @param {Object} options - Thông tin bổ sung
 * @param {string} options.ip - Địa chỉ IP
 * @param {string} options.device - Thông tin thiết bị
 * @returns {Promise<string>} Raw refresh token
 */
async function createRefreshToken(userId, { ip, device }) {
  const raw = randomTokenHex(48);
  const hash = sha256(raw);
  const expiresAt = new Date(Date.now() + getRefreshExpiryMs());
  
  await RefreshToken.create({
    user: userId,
    tokenHash: hash,
    ip,
    device,
    expiresAt,
  });
  
  return raw;
}

/**
 * XOAY VÒNG REFRESH TOKEN (TOKEN ROTATION)
 * - Vô hiệu hóa token cũ, tạo token mới
 * - Tăng cường bảo mật
 * 
 * @param {string} oldTokenRaw - Refresh token cũ
 * @param {string} userId - ID người dùng
 * @param {Object} opts - Tùy chọn
 * @returns {Promise<string>} Refresh token mới
 */
async function rotateRefreshToken(oldTokenRaw, userId, opts) {
  const oldHash = sha256(oldTokenRaw);
  const tokenRec = await RefreshToken.findOne({ 
    user: userId, 
    tokenHash: oldHash 
  });

  // 🔒 KIỂM TRA TOKEN HỢP LỆ
  if (!tokenRec || tokenRec.revoked) {
    // VÔ HIỆU HÓA TẤT CẢ TOKEN CỦA USER NẾU PHÁT HIỆN BẤT THƯỜNG
    await RefreshToken.updateMany({ user: userId }, { revoked: true });
    throw new Error('Refresh token không hợp lệ hoặc đã bị thu hồi');
  }

  // 🗑️ ĐÁNH DẤU TOKEN CŨ ĐÃ BỊ THU HỒI
  tokenRec.revoked = true;
  const newRaw = randomTokenHex(48);
  const newHash = sha256(newRaw);
  tokenRec.replacedBy = newHash;
  await tokenRec.save();

  // 🆕 TẠO TOKEN MỚI
  const expiresAt = new Date(Date.now() + getRefreshExpiryMs());
  await RefreshToken.create({
    user: userId,
    tokenHash: newHash,
    ip: opts.ip,
    device: opts.device,
    expiresAt,
  });

  return newRaw;
}

/**
 * ĐĂNG KÝ TÀI KHOẢN NGƯỜI DÙNG MỚI
 * 
 * @param {Object} userData - Thông tin đăng ký
 * @returns {Promise<Object>} User object
 */
/**
 * Đăng ký user mới với RBAC
 */
async function registerUser({ email, name, password, role, creatorId, ip, userAgent }) {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error('Email đã được sử dụng');
  }

  const pwdHash = await hashPassword(password);
  
  // User sẽ tự động tính toán canCreate trong pre-save middleware
  const user = new User({
    email,
    name,
    passwordHash: pwdHash,
    role: role || ROLES.PATIENT,
    createdBy: creatorId || null,
    // 🔐 Kích hoạt trạng thái user:
    // - Nếu creatorId tồn tại (admin/staff tạo) => ACTIVE
    // - Nếu không (self-register) và đang production => mặc định PENDING_VERIFICATION
    // - Có thể override bằng biến môi trường ALLOW_SELF_ACTIVATE=true (dùng tạm cho staging)
    status: (function() {
      const allowSelfActivate = (process.env.ALLOW_SELF_ACTIVATE || 'false').toLowerCase() === 'true';
      if (creatorId) return 'ACTIVE';
      if (process.env.NODE_ENV === 'production' && !allowSelfActivate) return 'PENDING_VERIFICATION';
      return 'ACTIVE';
    })()
  });

  await user.save();
  
  // 🏥 AUTO-CREATE PATIENT RECORD FOR PATIENT ROLE
  if (user.role === ROLES.PATIENT) {
    try {
      const patientId = `PAT-${user._id.toString().toUpperCase().slice(-8)}-${Date.now()}`;
      await Patient.create({
        userId: user._id,
        patientId,
        bloodType: 'UNKNOWN'
      });
      console.log(`🏥 Patient record created for user ${user._id}`);
    } catch (err) {
      console.error('❌ Error creating patient record:', err.message);
      // Don't throw - user is already created, we'll create patient record on first access
    }
  }
  
  // Ghi audit log
  await log(
    creatorId || user._id,
    creatorId ? 'REGISTER_USER' : 'SELF_REGISTER',
    { 
      targetUserId: user._id.toString(), 
      ip, 
      userAgent,
      email,
      role: user.role
    }
  );
  
  return user;
}

/**
 * ĐĂNG NHẬP HỆ THỐNG
 * 
 * @param {Object} credentials - Thông tin đăng nhập
 * @returns {Promise<Object>} Kết quả đăng nhập
 */
async function login({ email, password, ip, userAgent, twoFACode }) {
  console.log(`🔐 [LOGIN SERVICE] Attempting login for email: ${email}`);
  
  const user = await User.findOne({ email });
  
  console.log(`🔍 [LOGIN SERVICE] User found:`, user ? `Yes (${user._id})` : 'No');
  
  if (!user) {
    await log(null, 'LOGIN_FAILED', { email, ip, userAgent });
    throw new Error('Thông tin đăng nhập không chính xác');
  }

  if (user.isLocked) {
    await log(user._id, 'LOGIN_LOCKED', { ip, userAgent });
    throw new Error('Tài khoản đã bị khóa do đăng nhập sai nhiều lần');
  }

  // 🔐 DEV MODE: Allow PENDING_VERIFICATION in development
  if (process.env.NODE_ENV === 'production' && user.status !== 'ACTIVE') {
    await log(user._id, 'LOGIN_INACTIVE', { ip, userAgent });
    throw new Error('Tài khoản không hoạt động');
  }

  const ok = await comparePassword(password, user.passwordHash);
  console.log(`🔐 [LOGIN SERVICE] Password comparison:`, ok ? 'MATCH ✅' : 'NO MATCH ❌');
  
  if (!ok) {
    user.failedLoginAttempts += 1;
    
    if (user.failedLoginAttempts >= (process.env.MAX_LOGIN_ATTEMPTS || 5)) {
      user.lockUntil = new Date(Date.now() + (parseInt(process.env.LOCK_TIME_MS) || 15 * 60 * 1000));
      await log(user._id, 'ACCOUNT_LOCKED', { ip, userAgent });
    }
    
    await user.save();
    await log(user._id, 'LOGIN_FAILED', { ip, userAgent });
    throw new Error('Thông tin đăng nhập không chính xác');
  }

  // Xác thực 2FA
  if (user.twoFA && user.twoFA.enabled) {
    if (!twoFACode) {
      throw new Error('Yêu cầu mã xác thực 2 yếu tố');
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFA.secret,
      encoding: 'base32',
      token: twoFACode,
      window: 1,
    });

    if (!verified) {
      await log(user._id, 'LOGIN_2FA_FAILED', { ip, userAgent });
      throw new Error('Mã xác thực 2 yếu tố không hợp lệ');
    }
  }

  // Reset trạng thái đăng nhập
  user.failedLoginAttempts = 0;
  user.lockUntil = null;
  user.lastLogin = { ip, userAgent, at: new Date() };
  await user.save();

  // Tạo tokens với permissions
  const payload = { 
    sub: user._id, 
    email: user.email, 
    role: user.role, 
    permissions: ROLE_PERMISSIONS[user.role] || [],
    canCreate: user.canCreate || []
  };
  
  const accessToken = signAccessToken(payload);
  const refreshRaw = await createRefreshToken(user._id, { ip, device: userAgent });

  await log(user._id, 'LOGIN_SUCCESS', { ip, userAgent });
  
  return { 
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      canCreate: user.canCreate,
    }, 
    accessToken, 
    refreshToken: refreshRaw 
  };
}

/**
 * ĐĂNG XUẤT HỆ THỐNG
 * 
 * @param {string} userId - ID người dùng
 * @param {string} refreshTokenRaw - Refresh token cần thu hồi
 */
async function logout(userId, refreshTokenRaw) {
  try {
    // 🗑️ THU HỒI REFRESH TOKEN
    if (refreshTokenRaw) {
      const hash = sha256(refreshTokenRaw);
      await RefreshToken.updateOne({ 
        user: userId, 
        tokenHash: hash 
      }, { 
        revoked: true 
      });
    }
    
    // 📊 GHI AUDIT LOG
    await log(userId, 'LOGOUT', {});
  } catch (err) {
    console.error('❌ Lỗi đăng xuất:', err);
    // Không throw error để không ảnh hưởng user experience
  }
}

/**
 * LÀM MỚI ACCESS TOKEN BẰNG REFRESH TOKEN
 * 
 * @param {string} refreshTokenRaw - Refresh token hiện tại
 * @param {string} ip - Địa chỉ IP
 * @param {string} device - Thông tin thiết bị
 * @returns {Promise<Object>} Tokens mới
 */
async function refreshTokens(refreshTokenRaw, ip, device) {
  const hash = sha256(refreshTokenRaw);
  const tokenRec = await RefreshToken.findOne({ tokenHash: hash });

  // 🔒 KIỂM TRA TOKEN HỢP LỆ
  if (!tokenRec || tokenRec.revoked || tokenRec.expiresAt < new Date()) {
    // VÔ HIỆU HÓA TẤT CẢ TOKEN NẾU PHÁT HIỆN BẤT THƯỜNG
    if (tokenRec) {
      await RefreshToken.updateMany({ user: tokenRec.user }, { revoked: true });
    }
    throw new Error('Refresh token không hợp lệ');
  }

  // 🔍 TÌM USER TƯƠNG ỨNG
  const user = await User.findById(tokenRec.user);
  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  // 🔄 XOAY VÒNG TOKEN
  const newRaw = await rotateRefreshToken(refreshTokenRaw, user._id, { ip, device });
  
  // 🎫 TẠO ACCESS TOKEN MỚI
  const payload = { 
    sub: user._id, 
    email: user.email, 
    role: user.role, 
    permissions: user.canCreate || [] 
  };
  const accessToken = signAccessToken(payload);

  // 📊 GHI AUDIT LOG
  await log(user._id, 'REFRESH_TOKEN', { ip, userAgent: device });
  
  return { 
    accessToken, 
    refreshToken: newRaw 
  };
}

/**
 * SINH SECRET KEY CHO XÁC THỰC 2 YẾU TỐ
 * 
 * @returns {Object} Secret information
 */
function generate2FASecret() {
  const secret = speakeasy.generateSecret({ 
    length: 20,
    name: `MediAuth (${process.env.APP_NAME || 'System'})` // Tên app trong authenticator
  });
  
  return { 
    otpauth_url: secret.otpauth_url, 
    base32: secret.base32 
  };
}

/**
 * KÍCH HOẠT XÁC THỰC 2 YẾU TỐ CHO USER
 * 
 * @param {string} userId - ID người dùng
 * @param {string} base32Secret - Secret key base32
 * @returns {Promise<Object>} User object
 */
async function enable2FAForUser(userId, base32Secret) {
  const user = await User.findById(userId);
  user.twoFA = { 
    enabled: true, 
    secret: base32Secret 
  };
  await user.save();
  
  await log(userId, 'ENABLE_2FA');
  return user;
}

/**
 * VÔ HIỆU HÓA XÁC THỰC 2 YẾU TỐ
 * 
 * @param {string} userId - ID người dùng
 * @returns {Promise<Object>} User object
 */
async function disable2FAForUser(userId) {
  const user = await User.findById(userId);
  user.twoFA = { 
    enabled: false, 
    secret: null  // Xóa secret để bảo mật
  };
  await user.save();
  
  await log(userId, 'DISABLE_2FA');
  return user;
}

module.exports = {
  registerUser,
  login,
  logout,
  refreshTokens,
  createRefreshToken,
  rotateRefreshToken,
  generate2FASecret,
  enable2FAForUser,
  disable2FAForUser,
};