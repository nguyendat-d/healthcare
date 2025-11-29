// src/routes/billing.routes.js
const express = require('express');
const router = express.Router();
const { authenticate, requirePermission, requireRole } = require('../middlewares/auth.middleware');
const { ROLES, PERMISSIONS } = require('../constants/roles');
const billingController = require('../controllers/billing.controller');

router.use(authenticate);

// POST /api/billing - Tạo hóa đơn
router.post(
  '/',
  requireRole([ROLES.BILLING_STAFF, ROLES.HOSPITAL_ADMIN]),
  requirePermission(PERMISSIONS.CREATE_BILLS),
  billingController.create
);

// GET /api/billing/patient/:patientId - Danh sách hóa đơn của bệnh nhân
router.get(
  '/patient/:patientId',
  requirePermission(PERMISSIONS.VIEW_BILLS),
  billingController.getByPatient
);

// GET /api/billing/:id - Chi tiết hóa đơn
router.get(
  '/:id',
  requirePermission(PERMISSIONS.VIEW_BILLS),
  billingController.getById
);

// GET /api/billing/:billId/qr - Tạo mã QR thanh toán
router.get(
  '/:billId/qr',
  requirePermission(PERMISSIONS.VIEW_BILLS),
  billingController.generatePaymentQR
);

// PUT /api/billing/:billId/pay - Thanh toán
router.put(
  '/:billId/pay',
  requireRole([ROLES.BILLING_STAFF, ROLES.PATIENT]),
  requirePermission(PERMISSIONS.PROCESS_PAYMENTS),
  billingController.processPayment
);

module.exports = router;
