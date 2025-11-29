// src/routes/consultation.routes.js
const express = require('express');
const router = express.Router();
const { authenticate, requirePermission, requireRole } = require('../middlewares/auth.middleware');
const { ROLES, PERMISSIONS } = require('../constants/roles');
const consultationController = require('../controllers/consultation.controller');

router.use(authenticate);

// POST /api/consultation - Tạo tư vấn
router.post(
  '/',
  requireRole([ROLES.DOCTOR]),
  requirePermission(PERMISSIONS.CREATE_TREATMENT_PLANS),
  consultationController.create
);

// GET /api/consultation/:id - Chi tiết tư vấn
router.get(
  '/:id',
  requirePermission(PERMISSIONS.VIEW_TREATMENT_PLANS),
  consultationController.getById
);

// GET /api/consultation/patient/:patientId - Danh sách tư vấn của bệnh nhân
router.get(
  '/patient/:patientId',
  requirePermission(PERMISSIONS.VIEW_TREATMENT_PLANS),
  consultationController.getByPatient
);

module.exports = router;
