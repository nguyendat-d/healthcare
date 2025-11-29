// src/services/consultation.service.js
const Consultation = require('../models/consultation.model');
const { AppError } = require('../middlewares/error.middleware');

class ConsultationService {
  async create(data, doctorId) {
    try {
      const consultation = new Consultation({
        ...data,
        doctorId,
        consultationId: `CONS${Date.now()}`,
        status: 'COMPLETED'
      });
      await consultation.save();
      return consultation.populate('patientId doctorId');
    } catch (error) {
      throw error;
    }
  }

  async getByPatient(patientId) {
    try {
      return await Consultation.find({ patientId })
        .populate('doctorId', 'name')
        .sort({ consultationDate: -1 });
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const consultation = await Consultation.findById(id).populate('patientId doctorId');
      if (!consultation) throw new AppError('Không tìm thấy tư vấn', 404);
      return consultation;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ConsultationService();
