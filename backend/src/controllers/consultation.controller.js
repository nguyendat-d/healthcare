// src/controllers/consultation.controller.js
const consultationService = require('../services/consultation.service');

class ConsultationController {
  async create(req, res, next) {
    try {
      const consultation = await consultationService.create(req.body, req.user._id);
      res.status(201).json({
        success: true,
        message: 'Tạo tư vấn thành công',
        data: consultation
      });
    } catch (error) {
      next(error);
    }
  }

  async getByPatient(req, res, next) {
    try {
      const consultations = await consultationService.getByPatient(req.params.patientId);
      res.json({
        success: true,
        data: consultations
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const consultation = await consultationService.getById(req.params.id);
      res.json({
        success: true,
        data: consultation
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ConsultationController();
