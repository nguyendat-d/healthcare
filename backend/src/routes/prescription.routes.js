// src/routes/prescription.routes.js
const express = require('express');
const router = express.Router();
const { authenticate, requirePermission, requireRole } = require('../middlewares/auth.middleware');
const { ROLES, PERMISSIONS } = require('../constants/roles');
const prescriptionController = require('../controllers/prescription.controller');

router.use(authenticate);

// GET /api/prescriptions - Danh sách tất cả đơn thuốc (cho doctor)
router.get(
  '/',
  requirePermission(PERMISSIONS.VIEW_PRESCRIPTIONS),
  prescriptionController.getAll
);

// POST /api/prescriptions - Tạo đơn thuốc
router.post(
  '/',
  requireRole([ROLES.DOCTOR]),
  requirePermission(PERMISSIONS.CREATE_PRESCRIPTIONS),
  prescriptionController.create
);

// GET /api/prescriptions/patient/:patientId - Danh sách đơn thuốc của bệnh nhân
router.get(
  '/patient/:patientId',
  requirePermission(PERMISSIONS.VIEW_PRESCRIPTIONS),
  prescriptionController.getByPatient
);

// GET /api/prescriptions/:id - Chi tiết đơn thuốc
router.get(
  '/:id',
  requirePermission(PERMISSIONS.VIEW_PRESCRIPTIONS),
  prescriptionController.getById
);

// PUT /api/prescriptions/:id/dispense - Phát thuốc
router.put(
  '/:id/dispense',
  requireRole([ROLES.PHARMACIST]),
  requirePermission(PERMISSIONS.DISPENSE_MEDICATION),
  prescriptionController.dispense
);

module.exports = router;
