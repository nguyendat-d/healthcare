// src/routes/lab.routes.js
const express = require('express');
const router = express.Router();
const { authenticate, requirePermission, requireRole } = require('../middlewares/auth.middleware');
const { ROLES, PERMISSIONS } = require('../constants/roles');
const labController = require('../controllers/lab.controller');

router.use(authenticate);

// GET /api/lab - Danh sách tất cả xét nghiệm (cho doctor)
router.get(
  '/',
  requirePermission(PERMISSIONS.VIEW_LAB_RESULTS),
  labController.getAll
);

// POST /api/lab - Tạo đơn xét nghiệm
router.post(
  '/',
  requireRole([ROLES.DOCTOR]),
  requirePermission(PERMISSIONS.CREATE_LAB_RESULTS),
  labController.create
);

// GET /api/lab/:id - Chi tiết đơn xét nghiệm
router.get(
  '/:id',
  requirePermission(PERMISSIONS.VIEW_LAB_RESULTS),
  labController.getById
);

// GET /api/lab/patient/:patientId - Danh sách xét nghiệm của bệnh nhân
router.get(
  '/patient/:patientId',
  requirePermission(PERMISSIONS.VIEW_LAB_RESULTS),
  labController.getByPatient
);

// PUT /api/lab/:id/result - Cập nhật kết quả
router.put(
  '/:id/result',
  requireRole([ROLES.LAB_TECHNICIAN]),
  requirePermission(PERMISSIONS.UPDATE_LAB_RESULTS),
  labController.updateResult
);

module.exports = router;
