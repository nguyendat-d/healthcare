<h1 align="center">🏥 Healthcare Authentication System</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-4.x-lightgrey?logo=express" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-Authentication-orange?logo=jsonwebtokens" alt="JWT" />
  <img src="https://img.shields.io/badge/Status-Active-success?logo=github" alt="Status" />
</p>

<p align="center">
  🚀 Một hệ thống xác thực <b>toàn diện & bảo mật cao</b> cho các ứng dụng Healthcare, được xây dựng với kiến trúc <b>microservices</b> hiện đại, 
  <b>JWT + 2FA</b>, và <b>MongoDB Atlas</b>.  
</p>

---

## 👨‍💻 Nhóm Phát Triển — Dynamic Duo

| Thành viên | Vai trò | Công việc chính |
|-------------|----------|-----------------|
| **Võ Văn Luận (Leader)** | 🧠 Full-stack Developer | Thiết kế kiến trúc tổng thể, phát triển backend, bảo mật, database |
| **Nguyễn Phước Đại** | 🎨 Frontend Developer | UI/UX design, phát triển frontend, tích hợp API |

---

## ✨ Điểm Nổi Bật
✅ **Kiến trúc Microservices** dễ mở rộng và bảo trì  
🔐 **Bảo mật đa tầng:** JWT, 2FA, bcrypt, rate limit, Helmet  
🧩 **Phân quyền RBAC** linh hoạt cho 6 cấp độ người dùng  
🩺 **Giám sát hệ thống real-time** qua healthcheck & logging  
📘 **Codebase chuyên nghiệp**: validation, error handling, audit logs

---

## 🔑 Tính Năng Chính

### 🔒 Bảo Mật & Xác Thực
- JWT Authentication với Access & Refresh Tokens thông minh  
- Xác thực hai yếu tố (2FA) bằng Google Authenticator  
- Hash mật khẩu với `bcrypt (12 rounds salt)`  
- Rate limiting chống brute-force attacks  
- CORS & Helmet bảo vệ toàn diện header  
- Token rotation tự động làm mới refresh token  

### 👥 Quản Lý Người Dùng (RBAC)
| Role | Quyền hạn |
|------|------------|
| **SUPER_ADMIN** | Toàn quyền, không thể xoá hoặc sửa |
| **ADMIN** | Quản trị viên hệ thống |
| **MANAGER** | Quản lý phòng ban |
| **DOCTOR** | Nhân viên y tế |
| **STAFF** | Nhân viên hỗ trợ |
| **PATIENT** | Người dùng cuối |

> ⚡ Super Admin được **tự động tạo khi khởi chạy lần đầu**.

---

## 🏗️ Kiến Trúc Hệ Thống
```
healthcare-system/
├── src/
│ ├── config/ # App, DB, JWT configuration
│ ├── controllers/ # Xử lý request
│ ├── models/ # Mongoose schemas
│ ├── routes/ # Định nghĩa API endpoints
│ ├── middlewares/ # Auth, RBAC, rateLimiter
│ ├── services/ # Business logic
│ ├── utils/ # JWT, hash, email utilities
│ ├── validations/ # Joi validation schemas
│ └── app.js # Application entry point
└── README.md
```
---

## ⚙️ Cấu Hình Môi Trường `.env`

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
SALT_ROUNDS=12

SUPER_ADMIN_EMAIL=superadmin@healthcare.vn
SUPER_ADMIN_PASSWORD=SuperSecurePassword2024!
SUPER_ADMIN_NAME=System Root Administrator
```
🚀 Bắt Đầu Nhanh
⚡ Cài đặt & Chạy thủ công
# Clone project
```
git clone https://github.com/VanLuanIT24/healthcare-system.git
cd healthcare-system
```

# Cài đặt dependencies
```
npm install
```

# Cấu hình environment
```
cp .env.example .env
```

# Sau đó chỉnh sửa các biến trong .env

# Chạy ứng dụng
```
npm run dev      # Development mode
npm start        # Production mode
```

🐳 Chạy với Docker
```
docker-compose up -d
```

🧠 Token Flow & RBAC Matrix
```
Luồng xác thực:

Login → Access Token (15m) + Refresh Token (7d)
↓
Gọi API → gửi Access Token trong header
↓
Access Token hết hạn → làm mới bằng Refresh Token
↓
Token rotation → tạo Refresh Token mới, vô hiệu hóa token cũ
```

RBAC Matrix
```
{
  SUPER_ADMIN: ['CREATE_ADMIN', 'VIEW_AUDIT_LOGS', 'UPDATE_ANY_USER'],
  ADMIN: ['CREATE_MANAGER', 'CREATE_DOCTOR', 'READ_ANY_USER'],
  MANAGER: ['CREATE_STAFF', 'READ_ANY_USER'],
  DOCTOR: ['READ_ANY_USER'],
  STAFF: [],
  PATIENT: []
}
```

📊 Health Check & Monitoring
```
GET /health
```

Response mẫu
```
{
  "status": "healthy",
  "uptime": 3600.25,
  "environment": "production",
  "database": "connected"
}
```

---

## 🎨 Frontend - Giao Diện Người Dùng

### ✨ Tính Năng Frontend (90% Hoàn Thành)

#### 🏠 Super Admin Dashboard
- 📊 **Thống kê hệ thống** - Tổng quan các chỉ số chính
- 👥 **Quản lý người dùng** - CRUD người dùng, phân quyền
- 🏥 **Quản lý bệnh nhân** - Danh sách bệnh nhân, thông tin cá nhân
- 📅 **Quản lý lịch hẹn** - Theo dõi lịch hẹn bệnh nhân
- 📋 **Quản lý hồ sơ y tế** ✨ NEW - Diagnoses, Prescriptions, Lab Orders, Consultations
- 💳 **Quản lý hóa đơn** ✨ NEW - Invoices, Insurance, Payments
- 📝 **Xem nhật ký hệ thống** ✨ NEW - Audit logs với filtering
- 👨‍⚕️ **Dashboard Bác sĩ** ✨ NEW - Xem chi tiết dashboard cho bác sĩ
- ⚙️ **Cài đặt hệ thống** - Bảo mật, email configuration
- 🗑️ **Reset hệ thống** - Xoá dữ liệu test

#### 👤 Patient Dashboard  
- 📊 **Trang chủ** - Thống kê cá nhân
- 📋 **Hồ sơ y tế** - Xem các bản ghi y tế
- 📅 **Lịch hẹn** - Xem các cuộc hẹn
- 💊 **Đơn thuốc** - Xem đơn thuốc hiện tại
- 🛡️ **Bảo hiểm** - Thông tin bảo hiểm y tế
- 💳 **Hóa đơn** ✨ NEW - Xem các hóa đơn/biên lai
- 👤 **Thông tin cá nhân** - Hồ sơ người dùng

#### 👨‍⚕️ Doctor Dashboard ✨ NEW
- 📊 **Tổng quan** - Thống kê bệnh nhân và lịch hẹn
- 👥 **Bệnh nhân** - Danh sách bệnh nhân được giao
- 📅 **Lịch hẹn** - Quản lý lịch hẹn (Hoàn thành/Hủy)
- 📋 **Hồ sơ y tế** - Xem hồ sơ bệnh nhân

### 🛠️ Công Nghệ Frontend
| Công nghệ | Phiên bản | Mục đích |
|-----------|----------|---------|
| **React** | 18.2+ | UI Framework |
| **Ant Design** | 5.11+ | Component Library |
| **React Router** | 6.20+ | Routing |
| **Axios** | 1.6+ | HTTP Client |
| **Dayjs** | Latest | Date Handling |
| **Tailwind CSS** | Latest | Styling |
| **Vite** | Latest | Build Tool |

### 📁 Cấu Trúc Frontend
```
healthcare-frontend/
├── src/
│   ├── components/
│   │   ├── MedicalRecordManagement.jsx ✨ NEW
│   │   ├── BillingManagement.jsx ✨ NEW
│   │   ├── AuditLogViewer.jsx ✨ NEW
│   │   ├── DoctorDashboard.jsx ✨ NEW
│   │   ├── UserManagement.jsx
│   │   ├── PatientManagement.jsx
│   │   ├── AppointmentManagement.jsx
│   │   ├── SystemHealthDashboard.jsx
│   │   └── ... (8+ components)
│   ├── pages/
│   │   ├── SuperAdmin/
│   │   │   ├── Dashboard.jsx (updated)
│   │   │   ├── Login.jsx
│   │   │   └── ... (5+ pages)
│   │   └── PatientDashboard.jsx (updated)
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── utils/
│   │   ├── api.js
│   │   └── ...
│   ├── App.jsx (updated)
│   └── index.jsx
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

### 🚀 Chạy Frontend
```bash
cd healthcare-frontend
npm install
npm run dev
# Truy cập: http://localhost:5173
```

### 📊 Cải Tiến Frontend (So với Phase 1)
```
Phase 1: 30% hoàn thành
├── Basic auth, user management
├── Patient/appointment listing
└── Simple dashboards

Phase 2: 90% hoàn thành (+60%)
├── Medical records management ✨
├── Billing system ✨
├── Audit logging ✨
├── Doctor dashboard ✨
├── Patient invoices ✨
├── Advanced filtering & search
└── Status tracking & indicators
```

🧾 Công Nghệ Sử Dụng
| Công nghệ         | Mục đích         | Trang chủ                                                    |
| ----------------- | ---------------- | ------------------------------------------------------------ |
| **Express.js**    | Web framework    | [expressjs.com](https://expressjs.com)                       |
| **MongoDB Atlas** | Database         | [mongodb.com](https://mongodb.com)                           |
| **JWT**           | Authentication   | [jwt.io](https://jwt.io)                                     |
| **Joi**           | Validation       | [joi.dev](https://joi.dev)                                   |
| **bcryptjs**      | Password hashing | [npmjs.com/bcryptjs](https://www.npmjs.com/package/bcryptjs) |
| **Helmet**        | Security headers | [helmetjs.github.io](https://helmetjs.github.io)             |

🤝 Liên Hệ & Hỗ Trợ
| Thành viên           | GitHub                                          |
| -------------------- | ------------------------------------------------|
| **Võ Văn Luận**      | [@VanLuanIT24](https://github.com/VanLuanIT24)  |
| **Nguyễn Phước Đại** | [@phuocdai2004](https://github.com/phuocdai2004)|


📚 Tài liệu: GitHub Wiki
🐛 Báo lỗi: GitHub Issues
💡 Đề xuất: GitHub Discussions

<p align="center"> ⭐ <b>Star</b> repository nếu bạn thấy dự án hữu ích nhé! </p> <p align="center"> Developed with ❤️ by <b>Dynamic Duo Team</b> </p> 
#   H - T h - n g - Y - T -  
 #   h e a l t h c a r e  
 