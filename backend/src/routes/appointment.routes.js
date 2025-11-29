const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const appointmentValidation = require('../validations/appointment.validation');
const { validateBody, validateParams, validateQuery } = require('../middlewares/validation.middleware');
const { 
  requireRole, 
  requirePermission, 
  requirePatientDataAccess,
  requireModuleAccess 
} = require('../middlewares/rbac.middleware');
const { ROLES, PERMISSIONS } = require('../constants/roles');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * 📅 APPOINTMENT ROUTES
 * Quản lý tất cả endpoints liên quan đến lịch hẹn
 */

// 🎯 APPLY AUTH MIDDLEWARE CHO TẤT CẢ ROUTES
router.use(authenticate);

// 💰 LẤY DANH SÁCH CHỜ XÁC NHẬN THANH TOÁN (đặt trước các route có :params)
router.get(
  '/payments/pending',
  requireRole(ROLES.RECEPTIONIST, ROLES.HOSPITAL_ADMIN, ROLES.SUPER_ADMIN),
  requirePermission(PERMISSIONS.APPOINTMENT_VIEW),
  appointmentController.getPendingPayments
);

// 👨‍⚕️ LẤY LỊCH HẸN ĐÃ THANH TOÁN CỦA BÁC SĨ ĐANG LOGIN
router.get(
  '/my/paid',
  requireRole(ROLES.DOCTOR),
  requirePermission(PERMISSIONS.APPOINTMENT_VIEW),
  appointmentController.getDoctorPaidAppointments
);

// 🎯 TẠO LỊCH HẸN
router.post(
  '/',
  requireRole(ROLES.RECEPTIONIST, ROLES.DOCTOR, ROLES.PATIENT, ROLES.HOSPITAL_ADMIN),
  requirePermission(PERMISSIONS.APPOINTMENT_CREATE),
  validateBody(appointmentValidation.createAppointment),
  appointmentController.createAppointment
);

// 🎯 LẤY LỊCH HẸN CỦA BỆNH NHÂN
router.get(
  '/patient/:patientId',
  requireRole(ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST, ROLES.HOSPITAL_ADMIN, ROLES.PATIENT, ROLES.SUPER_ADMIN),
  requirePermission(PERMISSIONS.APPOINTMENT_VIEW),
  requirePatientDataAccess('patientId'),
  validateQuery(appointmentValidation.getPatientAppointments),
  appointmentController.getPatientAppointments
);

// 🎯 LẤY LỊCH HẸN CỦA BÁC SĨ
router.get(
  '/doctor/:doctorId',
  requireRole(ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST, ROLES.HOSPITAL_ADMIN, ROLES.DEPARTMENT_HEAD, ROLES.SUPER_ADMIN),
  requirePermission(PERMISSIONS.APPOINTMENT_VIEW),
  validateQuery(appointmentValidation.getDoctorAppointments),
  appointmentController.getDoctorAppointments
);

// 👨‍⚕️ LẤY LỊCH HẸN ĐÃ THANH TOÁN CHO BÁC SĨ
router.get(
  '/doctor/:doctorId/paid',
  requireRole(ROLES.DOCTOR, ROLES.HOSPITAL_ADMIN, ROLES.SUPER_ADMIN),
  requirePermission(PERMISSIONS.APPOINTMENT_VIEW),
  appointmentController.getDoctorPaidAppointments
);

// 🎯 LẤY THÔNG TIN LỊCH HẸN CHI TIẾT
router.get(
  '/:appointmentId',
  requireRole(ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST, ROLES.HOSPITAL_ADMIN, ROLES.PATIENT),
  requirePermission(PERMISSIONS.APPOINTMENT_VIEW),
  appointmentController.getAppointment
);

// 🎯 CẬP NHẬT LỊCH HẸN
router.put(
  '/:appointmentId',
  requireRole(ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.HOSPITAL_ADMIN),
  requirePermission(PERMISSIONS.APPOINTMENT_UPDATE),
  validateBody(appointmentValidation.updateAppointment),
  appointmentController.updateAppointment
);

// 🎯 HỦY LỊCH HẸN
router.post(
  '/:appointmentId/cancel',
  requireRole(ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.PATIENT, ROLES.HOSPITAL_ADMIN),
  requirePermission(PERMISSIONS.APPOINTMENT_CANCEL),
  validateBody(appointmentValidation.cancelAppointment),
  appointmentController.cancelAppointment
);

// 🎯 XÁC NHẬN LỊCH HẸN VÀ TẠO HÓA ĐƠN
router.post(
  '/:appointmentId/confirm',
  requireRole(ROLES.RECEPTIONIST, ROLES.HOSPITAL_ADMIN, ROLES.PATIENT),
  requirePermission(PERMISSIONS.APPOINTMENT_UPDATE),
  appointmentController.confirmAppointment
);

// 🎯 TẠO LỊCH LÀM VIỆC
router.post(
  '/schedules',
  requireRole(ROLES.DOCTOR, ROLES.HOSPITAL_ADMIN, ROLES.DEPARTMENT_HEAD),
  requirePermission(PERMISSIONS.APPOINTMENT_CREATE),
  validateBody(appointmentValidation.createSchedule),
  appointmentController.createSchedule
);

// 🎯 LẤY LỊCH LÀM VIỆC
router.get(
  '/schedules/doctor/:doctorId',
  requireRole(ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST, ROLES.HOSPITAL_ADMIN),
  requirePermission(PERMISSIONS.APPOINTMENT_VIEW_SCHEDULE),
  validateQuery(appointmentValidation.getDoctorSchedule),
  appointmentController.getDoctorSchedule
);

// 💰 XÁC NHẬN THANH TOÁN (Admin/Staff/Receptionist)
router.post(
  '/:appointmentId/payment/confirm',
  requireRole(ROLES.RECEPTIONIST, ROLES.HOSPITAL_ADMIN, ROLES.SUPER_ADMIN),
  requirePermission(PERMISSIONS.APPOINTMENT_UPDATE),
  appointmentController.confirmPayment
);

module.exports = router;