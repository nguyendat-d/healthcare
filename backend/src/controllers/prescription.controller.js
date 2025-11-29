// src/controllers/prescription.controller.js
const prescriptionService = require('../services/prescription.service');

class PrescriptionController {
  async create(req, res, next) {
    try {
      const prescription = await prescriptionService.create(req.body, req.user._id);
      res.status(201).json({
        success: true,
        message: 'Tạo đơn thuốc thành công',
        data: prescription
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { doctorId, page = 1, limit = 10 } = req.query;
      const prescriptions = await prescriptionService.getAll(doctorId || req.user._id, page, limit);
      res.json({
        success: true,
        data: prescriptions
      });
    } catch (error) {
      next(error);
    }
  }

  async getByPatient(req, res, next) {
    try {
      const prescriptions = await prescriptionService.getByPatient(req.params.patientId);
      res.json({
        success: true,
        data: prescriptions
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const prescription = await prescriptionService.getById(req.params.id);
      res.json({
        success: true,
        data: prescription
      });
    } catch (error) {
      next(error);
    }
  }

  async dispense(req, res, next) {
    try {
      const prescription = await prescriptionService.dispense(req.params.id);
      res.json({
        success: true,
        message: 'Phát thuốc thành công',
        data: prescription
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PrescriptionController();
