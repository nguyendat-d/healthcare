// src/services/prescription.service.js
const Prescription = require('../models/prescription.model');
const { AppError } = require('../middlewares/error.middleware');

class PrescriptionService {
  async create(data, doctorId) {
    try {
      // Transform simple medication format to full format if needed
      let medications = data.medications;
      if (medications && medications.length > 0) {
        medications = medications.map(med => {
          // If simple format, transform to full format
          if (med.name && !med.medication) {
            return {
              medication: {
                name: med.name,
                genericName: med.name,
                code: ''
              },
              dosage: {
                value: 1,
                unit: med.dosage || '1 viên',
                form: 'tablet'
              },
              frequency: {
                timesPerDay: parseInt(med.frequency?.match(/\d+/)?.[0]) || 1,
                interval: med.frequency || '1 lần/ngày',
                instructions: med.instructions || ''
              },
              duration: {
                value: parseInt(med.duration?.match(/\d+/)?.[0]) || 7,
                unit: 'days'
              },
              route: 'ORAL',
              totalQuantity: med.quantity || 1,
              instructions: med.instructions || ''
            };
          }
          return med;
        });
      }

      const prescription = new Prescription({
        patientId: data.patientId,
        appointmentId: data.appointmentId,
        medications,
        notes: data.notes,
        doctorId,
        prescriptionId: `RX${Date.now()}`,
        status: 'ACTIVE'
      });
      await prescription.save();
      return prescription.populate('patientId doctorId');
    } catch (error) {
      throw error;
    }
  }

  async getAll(doctorId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const prescriptions = await Prescription.find({ doctorId })
        .populate('patientId doctorId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      const total = await Prescription.countDocuments({ doctorId });
      return { prescriptions, total, page, limit };
    } catch (error) {
      throw error;
    }
  }

  async getByPatient(patientId) {
    try {
      return await Prescription.find({ patientId })
        .populate('patientId doctorId')
        .sort({ issueDate: -1 });
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const prescription = await Prescription.findById(id).populate('patientId doctorId');
      if (!prescription) throw new AppError('Không tìm thấy đơn thuốc', 404);
      return prescription;
    } catch (error) {
      throw error;
    }
  }

  async dispense(id) {
    try {
      return await Prescription.findByIdAndUpdate(
        id,
        { status: 'DISPENSED', dispensedDate: new Date() },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PrescriptionService();
