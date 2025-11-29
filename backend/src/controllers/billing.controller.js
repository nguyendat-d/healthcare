// src/controllers/billing.controller.js
const billingService = require('../services/billing.service');
const PaymentQRService = require('../services/paymentQR.service');

class BillingController {
  async create(req, res, next) {
    try {
      const bill = await billingService.createBill(req.body);
      res.status(201).json({
        success: true,
        message: 'Tạo hóa đơn thành công',
        data: bill
      });
    } catch (error) {
      next(error);
    }
  }

  async getByPatient(req, res, next) {
    try {
      const bills = await billingService.getByPatient(req.params.patientId);
      res.json({
        success: true,
        data: bills
      });
    } catch (error) {
      next(error);
    }
  }

  async processPayment(req, res, next) {
    try {
      const bill = await billingService.processPayment(req.params.billId, req.body);
      res.json({
        success: true,
        message: 'Thanh toán thành công',
        data: bill
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const bill = await billingService.getById(req.params.id);
      res.json({
        success: true,
        data: bill
      });
    } catch (error) {
      next(error);
    }
  }

  async generatePaymentQR(req, res, next) {
    try {
      const { billId } = req.params;
      const bill = await billingService.getById(billId);

      if (!bill) {
        return res.status(404).json({
          success: false,
          message: 'Hóa đơn không tồn tại'
        });
      }

      const paymentInfo = await PaymentQRService.createPaymentInfo({
        billId: bill._id,
        amount: bill.totalAmount,
        patientName: bill.patientId?.fullName || 'Unknown',
        bankCode: 'VCB',
        accountNo: process.env.BANK_ACCOUNT_NO || '1234567890',
        accountName: process.env.HOSPITAL_NAME || 'Healthcare Hospital'
      });

      res.json({
        success: true,
        message: 'Tạo mã QR thanh toán thành công',
        data: paymentInfo
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BillingController();

