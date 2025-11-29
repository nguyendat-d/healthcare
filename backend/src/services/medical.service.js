// src/services/medical.service.js
const MedicalRecord = require('../models/medicalRecord.model');
const User = require('../models/user.model');
const { AppError, ERROR_CODES } = require('../middlewares/error.middleware');

class MedicalService {
  async createRecord(data, doctorId) {
    try {
      const record = new MedicalRecord({
        ...data,
        doctorId,
        recordId: `MR${Date.now()}`
      });
      await record.save();
      return record.populate('patientId doctorId');
    } catch (error) {
      throw error;
    }
  }

  async getRecords(filters = {}) {
    try {
      const query = MedicalRecord.find(filters)
        .populate('patientId', 'name email')
        .populate('doctorId', 'name')
        .sort({ visitDate: -1 });
      
      const records = await query.exec();
      return records;
    } catch (error) {
      throw error;
    }
  }

  async getRecordById(recordId) {
    try {
      const record = await MedicalRecord.findById(recordId)
        .populate('patientId')
        .populate('doctorId');
      
      if (!record) {
        throw new AppError('Hồ sơ không tìm thấy', 404, ERROR_CODES.NOT_FOUND);
      }
      return record;
    } catch (error) {
      throw error;
    }
  }

  async updateRecord(recordId, data) {
    try {
      const record = await MedicalRecord.findByIdAndUpdate(
        recordId,
        data,
        { new: true, runValidators: true }
      ).populate('patientId doctorId');

      return record;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MedicalService();
