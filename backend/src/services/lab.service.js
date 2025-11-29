// src/services/lab.service.js
const LabOrder = require('../models/labOrder.model');
const { AppError } = require('../middlewares/error.middleware');

class LabService {
  async create(data, doctorId) {
    try {
      // Transform simple test format if needed
      let tests = data.tests;
      if (tests && tests.length > 0) {
        tests = tests.map(test => {
          return {
            testCode: test.testCode || `TEST${Date.now()}`,
            testName: test.testName,
            category: test.category || 'OTHER',
            specimenType: test.specimenType || 'BLOOD',
            instructions: test.instructions || '',
            status: 'ORDERED'
          };
        });
      }

      const order = new LabOrder({
        patientId: data.patientId,
        appointmentId: data.appointmentId,
        medicalRecordId: data.medicalRecordId || data.patientId, // fallback
        tests,
        clinicalNotes: data.clinicalNotes,
        priority: data.priority === 'NORMAL' ? 'ROUTINE' : data.priority,
        doctorId,
        orderId: `LAB${Date.now()}`,
        status: 'ORDERED'
      });
      await order.save();
      return order.populate('patientId doctorId');
    } catch (error) {
      throw error;
    }
  }

  async getAll(doctorId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const orders = await LabOrder.find({ doctorId })
        .populate('patientId doctorId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      const total = await LabOrder.countDocuments({ doctorId });
      return { orders, total, page, limit };
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const order = await LabOrder.findById(id).populate('patientId doctorId');
      if (!order) throw new AppError('Không tìm thấy đơn xét nghiệm', 404);
      return order;
    } catch (error) {
      throw error;
    }
  }

  async updateResult(id, result) {
    try {
      return await LabOrder.findByIdAndUpdate(
        id,
        { result, status: 'COMPLETED', completedDate: new Date() },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async getByPatient(patientId) {
    try {
      return await LabOrder.find({ patientId }).populate('patientId').sort({ orderDate: -1 });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new LabService();
