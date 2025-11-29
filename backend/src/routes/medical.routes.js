// src/routes/medical.routes.js
const express = require('express');
const router = express.Router();
const { authenticate, requirePermission, requireRole } = require('../middlewares/auth.middleware');
const { requirePatientDataAccess } = require('../middlewares/rbac.middleware');
const { ROLES, PERMISSIONS } = require('../constants/roles');
const medicalController = require('../controllers/medical.controller');

router.use(authenticate);

// GET /api/medical - Danh sách hồ sơ
router.get(
  '/',
  requirePermission(PERMISSIONS.VIEW_MEDICAL_RECORDS),
  medicalController.getRecords
);

// GET /api/medical/patient/:patientId - Hồ sơ y tế của bệnh nhân
router.get(
  '/patient/:patientId',
  requirePermission(PERMISSIONS.VIEW_MEDICAL_RECORDS),
  requirePatientDataAccess('patientId'),
  medicalController.getByPatient
);

// GET /api/medical/:recordId - Chi tiết hồ sơ
router.get(
  '/:recordId',
  requirePermission(PERMISSIONS.VIEW_MEDICAL_RECORDS),
  medicalController.getById
);

// POST /api/medical - Tạo hồ sơ
router.post(
  '/',
  requireRole([ROLES.DOCTOR, ROLES.NURSE, ROLES.DEPARTMENT_HEAD]),
  requirePermission(PERMISSIONS.CREATE_MEDICAL_RECORDS),
  medicalController.createRecord
);

// PUT /api/medical/:recordId - Cập nhật hồ sơ
router.put(
  '/:recordId',
  requirePermission(PERMISSIONS.UPDATE_MEDICAL_RECORDS),
  medicalController.update
);

module.exports = router;
