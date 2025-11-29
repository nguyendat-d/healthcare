const qrcode = require('qrcode');
const crypto = require('crypto-js');

/**
 * Tạo mã QR chuyển khoản ngân hàng
 * Hỗ trợ: Vietcombank, Agribank, BIDV, v.v.
 */
class PaymentQRService {
  /**
   * Tạo QR VietQR (Chuẩn QR ngân hàng VN)
   * @param {Object} data
   * @param {String} data.bankCode - Mã ngân hàng (VCB, BAB, CTG...)
   * @param {String} data.accountNo - Số tài khoản
   * @param {String} data.accountName - Tên chủ tài khoản
   * @param {Number} data.amount - Số tiền (đồng)
   * @param {String} data.description - Mô tả giao dịch (Mã hóa đơn)
   * @returns {Promise<String>} - Data URL của QR code
   */
  static async generateVietQR(data) {
    try {
      const {
        bankCode = 'VCB', // Vietcombank
        accountNo,
        accountName,
        amount,
        description = 'Thanh toan khám chữa bệnh'
      } = data;

      // Định dạng theo VietQR standard
      // Format: 00020101051700069704930203020000A00000050025341120069704930203020000A000000500253411300S104000VCB3500xxxxxx6330009VN40000000000020231202340208Khmer1234563033564060D0E
      
      // Tạo chuỗi QR đơn giản hơn (QR chứa thông tin chuyển khoản)
      const qrString = `
BANK|${bankCode}
ACCOUNT|${accountNo}
NAME|${accountName}
AMOUNT|${amount}
DESC|${description}
      `.trim();

      // Tạo QR code từ chuỗi
      const qrCodeDataUrl = await qrcode.toDataURL(qrString, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      return qrCodeDataUrl;
    } catch (error) {
      throw new Error(`Lỗi tạo QR: ${error.message}`);
    }
  }

  /**
   * Tạo mã thanh toán (Invoice Code)
   * Format: INV-TIMESTAMP-RANDOM
   */
  static generatePaymentCode() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `INV-${timestamp}-${random}`;
  }

  /**
   * Tạo hash để xác minh thanh toán
   */
  static generatePaymentHash(paymentCode, amount, secret) {
    const data = `${paymentCode}:${amount}:${secret}`;
    return crypto.SHA256(data).toString();
  }

  /**
   * Xác minh thanh toán
   */
  static verifyPayment(paymentCode, amount, hash, secret) {
    const expectedHash = this.generatePaymentHash(paymentCode, amount, secret);
    return hash === expectedHash;
  }

  /**
   * Tạo thông tin thanh toán đầy đủ
   */
  static async createPaymentInfo(billData) {
    const {
      billId,
      amount,
      patientName,
      bankCode = 'VCB',
      accountNo = '1234567890', // Thay bằng số tài khoản thực
      accountName = 'Healthcare Hospital'
    } = billData;

    const paymentCode = this.generatePaymentCode();
    const qrCode = await this.generateVietQR({
      bankCode,
      accountNo,
      accountName,
      amount,
      description: `HoaDon_${billId}`
    });

    return {
      paymentCode,
      amount,
      qrCode,
      bankInfo: {
        bankCode,
        accountNo,
        accountName
      },
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // Hết hạn 15 phút
      instructions: `
Quét mã QR hoặc chuyển khoản:
- Ngân hàng: ${bankCode}
- Số tài khoản: ${accountNo}
- Chủ tài khoản: ${accountName}
- Số tiền: ${amount.toLocaleString('vi-VN')}đ
- Nội dung: HoaDon_${billId}
      `.trim()
    };
  }
}

module.exports = PaymentQRService;
