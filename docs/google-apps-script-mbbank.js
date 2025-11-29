/**
 * 📧 GOOGLE APPS SCRIPT - TỰ ĐỘNG ĐỌC EMAIL MB BANK
 * 
 * 🔧 HƯỚNG DẪN SETUP:
 * 
 * 1. Vào https://script.google.com/
 * 2. Tạo project mới
 * 3. Paste toàn bộ code này vào
 * 4. Sửa WEBHOOK_URL thành URL backend của bạn
 * 5. Sửa WEBHOOK_SECRET khớp với backend
 * 6. Chạy hàm setup() 1 lần để cấp quyền
 * 7. Chạy hàm createTrigger() để tự động chạy mỗi 5 phút
 * 
 * ⚠️ LƯU Ý: 
 * - Gmail phải nhận được email thông báo từ MB Bank
 * - Bật thông báo email trong app MB Bank
 */

// ===== CẤU HÌNH =====
const CONFIG = {
  // 🔗 URL webhook backend của bạn (qua ngrok)
  WEBHOOK_URL: 'https://maleah-nonambitious-histrionically.ngrok-free.dev/api/webhook/payment',
  
  // 🔐 Secret key (phải khớp với backend)
  WEBHOOK_SECRET: 'healthcare-payment-secret-2024',
  
  // 📧 Từ khóa tìm email MB Bank (đã cập nhật theo email thực tế)
  SEARCH_QUERY: 'from:mbebanking@mbbank.com.vn',
  
  // ⏰ Chỉ xử lý email trong vòng X phút gần đây
  MINUTES_AGO: 30
};

/**
 * 🚀 HÀM CHÍNH - Đọc email và gửi webhook
 */
function checkMBBankEmails() {
  console.log('🔍 Checking MB Bank emails...');
  
  try {
    // Tìm email MB Bank chưa đọc
    const threads = GmailApp.search(CONFIG.SEARCH_QUERY + ' is:unread', 0, 10);
    
    console.log(`📧 Found ${threads.length} unread threads`);
    
    for (const thread of threads) {
      const messages = thread.getMessages();
      
      for (const message of messages) {
        if (message.isUnread()) {
          processEmail(message);
          message.markRead(); // Đánh dấu đã đọc
        }
      }
    }
    
    console.log('✅ Done checking emails');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * 📩 Xử lý 1 email
 */
function processEmail(message) {
  const subject = message.getSubject();
  const body = message.getPlainBody();
  const date = message.getDate();
  
  console.log(`📩 Processing email: ${subject}`);
  console.log(`📄 Body preview: ${body.substring(0, 200)}...`);
  
  // Parse thông tin từ email MB Bank
  const paymentInfo = parseMBBankEmail(body);
  
  if (paymentInfo && paymentInfo.amount > 0) {
    console.log(`💰 Found payment: ${JSON.stringify(paymentInfo)}`);
    
    // Gửi webhook đến backend
    sendWebhook(paymentInfo, date);
  } else {
    console.log('⚠️ Could not parse payment info');
  }
}

/**
 * 🔍 Parse nội dung email MB Bank
 * 
 * Email mẫu thực tế từ mbebanking@mbbank.com.vn:
 * 
 * *Ngày, giờ giao dịch*
 * 12-10-2025 23:08:32
 * 
 * *Loại giao dịch*
 * Chuyển tiền nội bộ
 * 
 * *Số tham chiếu*
 * 25101223081320203
 * 
 * *Tài khoản trích nợ* (tiền ĐI) hoặc *Tài khoản ghi có* (tiền VÀO)
 * NGUYEN PHUOC DAI - 90024122004 (VND)
 * 
 * *Số tiền giao dịch*
 * (VND) 700,000.00
 * 
 * *Nội dung chuyển tiền*
 * NGUYEN PHUOC DAI chuyen tien
 */
function parseMBBankEmail(body) {
  try {
    console.log('📄 Parsing email body...');
    console.log('📄 Full body length:', body.length);
    
    // Regex tìm số tiền - format: (VND) 30,000.00 (nằm trên dòng riêng)
    const amountMatch = body.match(/\(VND\)\s*([\d,]+)(?:\.00)?/i);
    
    // Regex tìm nội dung chuyển tiền - format mới với *Nội dung*
    // Pattern: *Nội dung chuyển tiền* hoặc *Nội dung* theo sau là dòng mới và nội dung
    let content = '';
    
    // Thử pattern 1: *Nội dung chuyển tiền* \n content
    const contentMatch1 = body.match(/\*Nội dung(?:\s+chuyển tiền)?\*[\s\n\r]+([^\n\r\*]+)/i);
    if (contentMatch1) {
      content = contentMatch1[1].trim();
    }
    
    // Thử pattern 2: Nội dung chuyển tiền: content (cùng dòng)
    if (!content) {
      const contentMatch2 = body.match(/Nội dung[^:]*:\s*([^\n\r]+)/i);
      if (contentMatch2) {
        content = contentMatch2[1].trim();
      }
    }
    
    // Regex tìm số tham chiếu - format: *Số tham chiếu* \n 25101223081320203
    let transactionId = `MB${Date.now()}`;
    const refMatch1 = body.match(/\*Số tham chiếu\*[\s\n\r]+(\d+)/i);
    if (refMatch1) {
      transactionId = refMatch1[1];
    } else {
      const refMatch2 = body.match(/Số tham chiếu[:\s]*(\d+)/i);
      if (refMatch2) {
        transactionId = refMatch2[1];
      }
    }
    
    // Kiểm tra xem có phải tiền VÀO không
    // "Tài khoản ghi có" = tiền VÀO
    // "Tài khoản trích nợ" = tiền ĐI
    const isIncoming = body.includes('Tài khoản ghi có') || 
                       body.includes('tiền vào') || 
                       body.includes('nhận được');
    
    if (amountMatch) {
      const amountStr = amountMatch[1].replace(/,/g, '');
      const amount = parseFloat(amountStr);
      
      console.log(`💰 Amount: ${amount}`);
      console.log(`📝 Content: "${content}"`);
      console.log(`🔖 TransactionId: ${transactionId}`);
      console.log(`📥 Is incoming: ${isIncoming}`);
      
      return {
        amount: amount,
        content: content,
        transactionId: transactionId,
        bankAccount: '90024122004',
        isIncoming: isIncoming
      };
    }
    
    return null;
    
  } catch (error) {
    console.error('❌ Parse error:', error);
    return null;
  }
}

/**
 * 📤 Gửi webhook đến backend
 */
function sendWebhook(paymentInfo, timestamp) {
  const payload = {
    secret: CONFIG.WEBHOOK_SECRET,
    amount: paymentInfo.amount,
    content: paymentInfo.content,
    transactionId: paymentInfo.transactionId,
    bankAccount: paymentInfo.bankAccount,
    timestamp: timestamp.toISOString()
  };
  
  console.log(`📤 Sending webhook to: ${CONFIG.WEBHOOK_URL}`);
  console.log(`📦 Payload: ${JSON.stringify(payload)}`);
  
  try {
    const response = UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      contentType: 'application/json',
      headers: {
        'ngrok-skip-browser-warning': 'true'  // Bypass ngrok browser warning
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();
    
    console.log(`📥 Response: ${responseCode} - ${responseBody}`);
    
    if (responseCode === 200) {
      console.log('✅ Webhook sent successfully!');
    } else {
      console.log('⚠️ Webhook returned non-200 status');
    }
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
  }
}

/**
 * 🔧 SETUP - Chạy 1 lần để cấp quyền Gmail
 */
function setup() {
  // Yêu cầu quyền đọc Gmail
  const threads = GmailApp.search('is:unread', 0, 1);
  console.log('✅ Setup complete! Gmail access granted.');
  console.log(`Found ${threads.length} unread emails`);
}

/**
 * ⏰ TẠO TRIGGER - Tự động chạy mỗi 5 phút
 */
function createTrigger() {
  // Xóa trigger cũ
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'checkMBBankEmails') {
      ScriptApp.deleteTrigger(trigger);
    }
  }
  
  // Tạo trigger mới - chạy mỗi 5 phút
  ScriptApp.newTrigger('checkMBBankEmails')
    .timeBased()
    .everyMinutes(5)
    .create();
    
  console.log('✅ Trigger created! Will check emails every 5 minutes.');
}

/**
 * 🧪 TEST - Kiểm tra webhook
 */
function testWebhook() {
  const testPayload = {
    secret: CONFIG.WEBHOOK_SECRET,
    amount: 5000,
    content: 'AP12345678 Thanh toan kham benh',
    transactionId: 'TEST' + Date.now(),
    bankAccount: '90024122004',
    timestamp: new Date().toISOString()
  };
  
  console.log('🧪 Testing webhook...');
  
  try {
    const response = UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      contentType: 'application/json',
      headers: {
        'ngrok-skip-browser-warning': 'true'  // Bypass ngrok browser warning
      },
      payload: JSON.stringify(testPayload),
      muteHttpExceptions: true
    });
    
    console.log(`Response: ${response.getResponseCode()}`);
    console.log(`Body: ${response.getContentText()}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * 🧪 TEST - Simulate email parsing với format thực tế
 */
function testParsing() {
  // Email mẫu ĐÚNG format thực tế từ MB Bank (có dấu * và xuống dòng)
  const sampleEmail = `
Cảm ơn Quý khách đã sử dụng dịch vụ MB eBanking.
MB xin thông báo giao dịch của Quý khách đã được thực hiện như sau:


*Ngày, giờ giao dịch*

27-11-2025 08:50:03

*Loại giao dịch*

Chuyển tiền nhanh ngoài MB

*Số tham chiếu*

25112708501360203

*Tài khoản ghi có*

NGUYEN PHUOC DAI - 90024122004 (VND)

*Số tiền giao dịch*

(VND) 5,000.00

*Nội dung chuyển tiền*

683559cd1bae81af3e65d0c4 KCB

*Tình trạng*

Giao dịch thành công
  `;
  
  console.log('🧪 Testing with real MB Bank email format...');
  const result = parseMBBankEmail(sampleEmail);
  console.log('Parsed result:', JSON.stringify(result, null, 2));
  
  // Kiểm tra kết quả
  if (result) {
    console.log('\n✅ Parse successful!');
    console.log(`   Amount: ${result.amount} (expected: 5000)`);
    console.log(`   Content: "${result.content}" (expected: "683559cd1bae81af3e65d0c4 KCB")`);
    console.log(`   TransactionId: ${result.transactionId} (expected: "25112708501360203")`);
    console.log(`   IsIncoming: ${result.isIncoming} (expected: true)`);
  } else {
    console.log('\n❌ Parse failed!');
  }
}
