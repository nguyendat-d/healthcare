// src/controllers/medical.controller.js
const medicalService = require('../services/medical.service');
const { AppError } = require('../middlewares/error.middleware');

class MedicalController {
  async createRecord(req, res, next) {
    try {
      const record = await medicalService.createRecord(req.body, req.user._id);
      res.status(201).json({
        success: true,
        message: 'Tạo hồ sơ bệnh án thành công',
        data: record
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecords(req, res, next) {
    try {
      const records = await medicalService.getRecords();
      res.json({
        success: true,
        data: records
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const record = await medicalService.getRecordById(req.params.recordId);
      res.json({
        success: true,
        data: record
      });
    } catch (error) {
      next(error);
    }
  }

  async getByPatient(req, res, next) {
    try {
      const records = await medicalService.getRecords({ patientId: req.params.patientId });
      res.json({
        success: true,
        data: records
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const record = await medicalService.updateRecord(req.params.recordId, req.body);
      res.json({
        success: true,
        message: 'Cập nhật hồ sơ bệnh án thành công',
        data: record
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MedicalController();
