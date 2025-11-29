// src/controllers/lab.controller.js
const labService = require('../services/lab.service');

class LabController {
  async create(req, res, next) {
    try {
      const order = await labService.create(req.body, req.user._id);
      res.status(201).json({
        success: true,
        message: 'Tạo đơn xét nghiệm thành công',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { doctorId, page = 1, limit = 10 } = req.query;
      const orders = await labService.getAll(doctorId || req.user._id, page, limit);
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const order = await labService.getById(req.params.id);
      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  async updateResult(req, res, next) {
    try {
      const order = await labService.updateResult(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Cập nhật kết quả xét nghiệm thành công',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  async getByPatient(req, res, next) {
    try {
      const orders = await labService.getByPatient(req.params.patientId);
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LabController();
