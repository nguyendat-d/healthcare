const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment.model');

/**
 * 🔔 WEBHOOK ROUTES - Nhận thông báo thanh toán tự động
 * Endpoint: POST /api/webhook/payment
 */

// Secret key để bảo mật webhook (đổi thành key riêng của bạn)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'healthcare-payment-secret-2024';

/**
 * 📧 WEBHOOK: Nhận thông báo từ Google Apps Script khi có email MB Bank
 * POST /api/webhook/payment
 */
router.post('/payment', async (req, res) => {
  try {
    console.log('🔔 [WEBHOOK] Received payment notification');
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));

    const { secret, amount, content, transactionId, bankAccount, timestamp } = req.body;

    // 🔐 Kiểm tra secret key
    if (secret !== WEBHOOK_SECRET) {
      console.log('❌ [WEBHOOK] Invalid secret key');
      return res.status(401).json({ success: false, message: 'Invalid secret key' });
    }

    // 🔍 Parse nội dung chuyển khoản để tìm mã lịch hẹn
    // Nội dung mẫu: "Thanh toan kham benh AP12345678"
    const appointmentIdMatch = content?.match(/AP[A-Z0-9]{8}/i);
    
    if (!appointmentIdMatch) {
      console.log('⚠️ [WEBHOOK] No appointment ID found in content:', content);
      return res.json({ 
        success: false, 
        message: 'No appointment ID found in transfer content',
        content 
      });
    }

    const appointmentId = appointmentIdMatch[0].toUpperCase();
    console.log('🎯 [WEBHOOK] Found appointment ID:', appointmentId);

    // 🔍 Tìm lịch hẹn
    const appointment = await Appointment.findOne({ appointmentId });

    if (!appointment) {
      console.log('❌ [WEBHOOK] Appointment not found:', appointmentId);
      return res.json({ 
        success: false, 
        message: 'Appointment not found',
        appointmentId 
      });
    }

    // ✅ Kiểm tra đã thanh toán chưa
    if (appointment.payment?.status === 'PAID' || appointment.payment?.status === 'CONFIRMED') {
      console.log('⚠️ [WEBHOOK] Already paid:', appointmentId);
      return res.json({ 
        success: true, 
        message: 'Already paid',
        appointmentId 
      });
    }

    // 💰 Cập nhật trạng thái thanh toán
    appointment.payment = {
      status: 'PAID',
      method: 'BANK_TRANSFER',
      amount: parseFloat(amount) || appointment.payment?.amount || 5000,
      transactionId: transactionId || `AUTO-${Date.now()}`,
      paidAt: new Date(timestamp) || new Date(),
      confirmedAt: new Date(),
      notes: `Tự động xác nhận từ email MB Bank. Nội dung: ${content}`
    };

    // Cập nhật trạng thái appointment
    appointment.status = 'CONFIRMED';

    await appointment.save();

    console.log('✅ [WEBHOOK] Payment confirmed for:', appointmentId);

    return res.json({
      success: true,
      message: 'Payment confirmed successfully',
      appointmentId,
      amount: appointment.payment.amount
    });

  } catch (error) {
    console.error('❌ [WEBHOOK] Error:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

/**
 * 🧪 TEST: Kiểm tra webhook hoạt động
 * GET /api/webhook/test
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: '🎉 Webhook is working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      payment: 'POST /api/webhook/payment'
    }
  });
});

module.exports = router;
