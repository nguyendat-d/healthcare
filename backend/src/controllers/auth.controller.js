// src/controllers/auth.controller.js
const ms = require('ms');
const authService = require('../services/auth.service');
const { registerSchema, loginSchema } = require('../validations/auth.validation');
const { log } = require('../services/audit.service');
const { ROLES, PERMISSIONS, hasPermission, canCreateRole } = require('../constants/roles');

/**
 * Tính thời gian sống của Refresh Token
 */
function getRefreshExpiryMs() {
  const refreshExpiry = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
  return ms(refreshExpiry);
}

/**
 * [POST] /api/auth/register
 * Đăng ký tài khoản người dùng mới với RBAC
 */
async function register(req, res, next) {
  try {
    // Validation happens in middleware now, so req.body should be clean
    const { email, name, password, confirmPassword, role } = req.body;

    const creator = req.user || null;
    const requestedRole = role || ROLES.PATIENT;

    // 🔐 RBAC PERMISSION CHECK
    if (creator) {
      // Kiểm tra quyền tạo user với role cụ thể
      const requiredPermission = getRegisterPermission(requestedRole);
      if (!hasPermission(creator.role, requiredPermission)) {
        return res.status(403).json({ 
          success: false,
          error: 'Không có quyền tạo user với role này' 
        });
      }

      // Kiểm tra hierarchy: chỉ được tạo role thấp hơn
      if (!canCreateRole(creator.role, requestedRole)) {
        return res.status(403).json({ 
          success: false,
          error: 'Không được phép tạo user với role cao hơn hoặc bằng' 
        });
      }
    } else {
      // Tự đăng ký: chỉ được tạo PATIENT
      if (requestedRole !== ROLES.PATIENT) {
        return res.status(403).json({ 
          success: false,
          error: 'Chỉ được phép đăng ký tài khoản bệnh nhân' 
        });
      }

      // Kiểm tra quyền SELF_REGISTER cho GUEST
      if (!hasPermission(ROLES.GUEST, PERMISSIONS.SELF_REGISTER)) {
        return res.status(403).json({ 
          success: false,
          error: 'Tính năng đăng ký đang bị tạm khóa' 
        });
      }
    }

    // Gọi service đăng ký
    const user = await authService.registerUser({
      email,
      name,
      password,
      role: requestedRole,
      creatorId: creator ? creator.sub : null,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Ghi audit log
    await log(
      creator ? creator.sub : user._id,
      creator ? 'REGISTER_USER' : 'SELF_REGISTER',
      { email: user.email, role: requestedRole, ip: req.ip, userAgent: req.headers['user-agent'] }
    );

    res.status(201).json({ 
      success: true,
      message: 'Đăng ký thành công', 
      data: {
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });

  } catch (err) {
    console.error('Register controller error:', err);
    
    const status = err.statusCode || 400;
    const message = err.message || 'Đăng ký thất bại';
    
    res.status(status).json({ 
      success: false,
      error: message,
      ...(process.env.NODE_ENV === 'development' && { details: err.stack })
    });
  }
}

/**
 * [POST] /api/auth/login
 * Đăng nhập với RBAC permission check
 */
async function login(req, res, next) {
  try {
    console.log('🔐 LOGIN REQUEST BODY:', req.body);
    console.log('🔐 REQUEST HEADERS:', req.headers);
    
    // Note: Validation happens in middleware now, so req.body should be clean
    const { email, password, twoFACode } = req.body;

    console.log('🔐 Extracted fields:', { email, password: password ? '***' : undefined, twoFACode });

    // Kiểm tra quyền LOGIN cơ bản (có thể dựa trên IP/rate limiting sau)
    if (!hasPermission(ROLES.GUEST, PERMISSIONS.LOGIN)) {
      return res.status(403).json({ 
        success: false,
        error: 'Tính năng đăng nhập tạm thời bị vô hiệu hóa' 
      });
    }

    const result = await authService.login({
      email,
      password,
      twoFACode,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Thiết lập refresh token cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: getRefreshExpiryMs(),
    });

    // Ghi audit log
    await log(result.user._id, 'LOGIN_SUCCESS', { ip: req.ip, userAgent: req.headers['user-agent'] });

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          _id: result.user._id,
          id: result.user._id,
          email: result.user.email,
          role: result.user.role,
          name: result.user.name,
        },
        tokens: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        }
      }
    });

  } catch (err) {
    console.error('Login controller error:', err);
    
    // Ghi audit log lỗi
    try {
      await log(null, 'LOGIN_FAILED', { error: err.message, ip: req.ip, userAgent: req.headers['user-agent'] });
    } catch (auditErr) {
      console.error('Audit log error:', auditErr);
    }

    const status = err.statusCode || 400;
    const message = err.message || 'Đăng nhập thất bại';
    
    res.status(status).json({ 
      success: false,
      error: message,
      ...(process.env.NODE_ENV === 'development' && { details: err.stack })
    });
  }
}

/**
 * [POST] /api/auth/logout
 * Đăng xuất với RBAC permission check
 */
async function logout(req, res) {
  try {
    const user = req.user;
    const refreshToken = req.cookies?.refreshToken;

    // Kiểm tra quyền LOGOUT
    if (!hasPermission(user.role, PERMISSIONS.LOGOUT)) {
      return res.status(403).json({ error: 'Không có quyền đăng xuất' });
    }

    await authService.logout(user.sub, refreshToken);
    
    res.clearCookie('refreshToken');

    await log('LOGOUT', user.sub, 'Đã đăng xuất', req.ip);

    res.json({ message: 'Đăng xuất thành công' });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/**
 * [POST] /api/auth/refresh
 * Làm mới token
 */
async function refresh(req, res) {
  try {
    const refreshToken = req.cookies?.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Không tìm thấy refresh token' });
    }

    const { accessToken, refreshToken: newRefresh } = await authService.refreshTokens(
      refreshToken,
      req.ip,
      req.headers['user-agent']
    );

    res.cookie('refreshToken', newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: getRefreshExpiryMs(),
    });

    res.json({ accessToken });

  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

/**
 * [GET] /api/auth/me
 * Lấy thông tin user hiện tại với permissions
 */
async function getCurrentUser(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const user = req.user;
    
    const userWithPermissions = {
      id: user.sub || user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      permissions: user.permissions || [],
      canCreate: user.canCreate || [],
    };

    res.json({
      success: true,
      data: userWithPermissions
    });

  } catch (err) {
    console.error('❌ Error in getCurrentUser:', err);
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
}

/**
 * Hàm hỗ trợ: Ánh xạ role -> permission cần thiết để tạo
 */
function getRegisterPermission(role) {
  const permissionMap = {
    [ROLES.ADMIN]: PERMISSIONS.REGISTER_ADMIN,
    [ROLES.MANAGER]: PERMISSIONS.REGISTER_MANAGER,
    [ROLES.DOCTOR]: PERMISSIONS.REGISTER_DOCTOR,
    [ROLES.STAFF]: PERMISSIONS.REGISTER_STAFF,
    [ROLES.PATIENT]: PERMISSIONS.REGISTER_PATIENT,
  };

  return permissionMap[role] || PERMISSIONS.REGISTER_PATIENT;
}

/**
 * [GET] /api/auth/2fa/generate
 * Tạo secret key cho xác thực 2 yếu tố (2FA)
 * - Private endpoint (yêu cầu xác thực)
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function generate2FA(req, res) {
  try {
    // Tạo secret key cho 2FA
    const secret = authService.generate2FASecret();
    
    // Trả về thông tin secret (otpauth_url và base32)
    res.json(secret);

  } catch (err) {
    // Xử lý lỗi tạo 2FA
    res.status(400).json({ error: err.message });
  }
}

/**
 * [POST] /api/auth/2fa/enable
 * Kích hoạt xác thực 2 yếu tố cho user
 * - Private endpoint (yêu cầu xác thực)
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function enable2FA(req, res) {
  try {
    const { token, base32 } = req.body; // Mã xác thực và secret key
    const userId = req.user.sub; // ID user từ token

    // XÁC THỰC MÃ 2FA
    const valid = require('speakeasy').totp.verify({
      secret: base32,
      encoding: 'base32',
      token: token,
      window: 1, // Cho phép sai số thời gian (1 khoảng = 30 giây)
    });

    // Kiểm tra tính hợp lệ của mã
    if (!valid) {
      return res.status(400).json({ error: 'Mã xác thực 2FA không hợp lệ' });
    }

    // KÍCH HOẠT 2FA CHO USER
    await authService.enable2FAForUser(userId, base32);
    
    // Ghi log sự kiện kích hoạt 2FA
    await log('2FA_ENABLED', userId, 'Đã kích hoạt xác thực 2 yếu tố', req.ip);

    // Trả về response thành công
    res.json({ message: 'Đã kích hoạt xác thực 2 yếu tố thành công' });

  } catch (err) {
    // Xử lý lỗi kích hoạt 2FA
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  register,
  login,
  logout,
  refresh,
  getCurrentUser,
  generate2FA,
  enable2FA,
};