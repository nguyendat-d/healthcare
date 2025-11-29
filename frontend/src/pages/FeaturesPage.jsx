import React from 'react';
import { Button, Row, Col, Card, Space, Tabs, Badge } from 'antd';
import { CheckOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const FeaturesPage = () => {
  const navigate = useNavigate();

  const detailedFeatures = [
    {
      icon: '🔒',
      title: 'Bảo Mật Tối Đa',
      description: 'Mã hóa end-to-end, bảo vệ HIPAA, audit logs đầy đủ',
      details: [
        'Encryption AES-256 cho tất cả dữ liệu',
        'HIPAA Compliant - tuân thủ quy định y tế',
        'Data Backup 24/7 tự động',
        'Multi-factor authentication (2FA)',
        'Audit logs chi tiết mỗi hành động'
      ]
    },
    {
      icon: '👥',
      title: 'Quản Lý Đa Vai Trò',
      description: '6 vai trò với quyền hạn chi tiết',
      details: [
        'Super Admin - Toàn quyền hệ thống',
        'Admin - Quản trị viên hệ thống',
        'Manager - Quản lý phòng ban',
        'Doctor - Nhân viên y tế',
        'Staff - Nhân viên hỗ trợ',
        'Patient - Người dùng bệnh nhân'
      ]
    },
    {
      icon: '📋',
      title: 'Quản Lý Hồ Sơ Y Tế',
      description: 'Toàn bộ hồ sơ tức thời, dễ truy cập',
      details: [
        'Hồ sơ bệnh nhân đầy đủ',
        'Lịch hẹn và nhắc nhở tự động',
        'Đơn thuốc điện tử',
        'Xét nghiệm và chẩn đoán',
        'Hóa đơn và thanh toán',
        'Lịch sử điều trị chi tiết'
      ]
    },
    {
      icon: '📊',
      title: 'Analytics & Reporting',
      description: 'Dashboard trực quan, báo cáo chi tiết',
      details: [
        'Dashboard real-time cập nhật liên tục',
        'Báo cáo tùy chỉnh theo nhu cầu',
        'Xuất dữ liệu Excel/PDF tự động',
        'Biểu đồ phân tích chi tiết',
        'KPI tracking cho quản lý',
        'Predictive analytics'
      ]
    },
    {
      icon: '📅',
      title: 'Lịch Hẹn Thông Minh',
      description: 'Đặt lịch tự động, nhắc nhở đủ cách',
      details: [
        'Đặt lịch online 24/7 cho bệnh nhân',
        'Nhắc nhở qua Email, SMS, Push',
        'Quản lý phòng khám và phòng bệnh',
        'Tối ưu hóa thời gian chờ',
        'Xử lý hủy/dời lịch tự động',
        'Integration với calendar (Google, Outlook)'
      ]
    },
    {
      icon: '✅',
      title: 'Kiểm Soát Chất Lượng',
      description: 'Audit logs, compliance tracking',
      details: [
        'Full audit trail cho mỗi hành động',
        'Version control cho hồ sơ',
        'Compliance tracking HIPAA/GDPR',
        'Digital signatures cho tài liệu',
        'Workflow approval tự động',
        'Lưu giữ dữ liệu theo luật'
      ]
    }
  ];

  const useCases = [
    {
      title: 'Bệnh Viện Lớn',
      icon: '🏥',
      description: 'Quản lý hàng nghìn bệnh nhân, nhiều phòng ban',
      benefits: ['Quản lý đa bộ phận', 'Analytics nâng cao', 'Integration APIs']
    },
    {
      title: 'Phòng Khám',
      icon: '⚕️',
      description: 'Quản lý phòng khám nhỏ, linh hoạt',
      benefits: ['Gọn nhẹ, dễ sử dụng', 'Chi phí thấp', 'Setup nhanh']
    },
    {
      title: 'Tập Đoàn Y Tế',
      icon: '🌐',
      description: 'Quản lý nhiều cơ sở ở các địa điểm khác nhau',
      benefits: ['Multi-location', 'Centralized control', 'Advanced reporting']
    }
  ];

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#ffffff' }}>
      {/* Header */}
      <div 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: '#ffffff',
          padding: '12px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0, 153, 204, 0.08)',
          borderBottom: '1px solid #e0f2fe'
        }}
      >
        <Logo size="medium" showText={true} />
        <Space>
          <Button type="text" onClick={() => navigate('/')} style={{ color: '#0099cc' }}>
            Trang Chủ
          </Button>
          <Button type="text" onClick={() => navigate('/pricing')} style={{ color: '#0099cc' }}>
            Giá Cả
          </Button>
          <Button type="primary" onClick={() => navigate('/superadmin/register')}>
            Đăng Ký
          </Button>
        </Space>
      </div>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0099cc 0%, #0077aa 100%)',
        padding: '60px 40px',
        textAlign: 'center',
        color: '#ffffff'
      }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px' }}>
          Tính Năng Toàn Diện
        </h1>
        <p style={{ fontSize: '18px', color: '#a5f3fc', maxWidth: '600px', margin: '0 auto' }}>
          Khám phá đầy đủ các tính năng mạnh mẽ của Healthcare System
        </p>
      </div>

      {/* Detailed Features */}
      <div style={{ padding: '80px 40px', background: '#f8fdfb' }}>
        <h2 style={{
          fontSize: '40px',
          fontWeight: '800',
          color: '#0099cc',
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          6 Tính Năng Core Chi Tiết
        </h2>
        <Row gutter={[24, 24]}>
          {detailedFeatures.map((feature, idx) => (
            <Col xs={24} md={12} key={idx}>
              <Card style={{
                border: '2px solid #a5f3fc',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ fontSize: '40px', minWidth: '50px' }}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0099cc', marginBottom: '8px' }}>
                      {feature.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                      {feature.description}
                    </p>
                    <div>
                      {feature.details.map((detail, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                          <CheckOutlined style={{ color: '#10b981', marginRight: '10px', fontWeight: 'bold' }} />
                          <span style={{ fontSize: '13px', color: '#1e293b' }}>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Use Cases */}
      <div style={{ padding: '80px 40px', background: '#ffffff' }}>
        <h2 style={{
          fontSize: '40px',
          fontWeight: '800',
          color: '#0099cc',
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          📌 Phù Hợp Với Các Loại Hình
        </h2>
        <Row gutter={[32, 32]}>
          {useCases.map((useCase, idx) => (
            <Col xs={24} md={8} key={idx}>
              <Card style={{
                border: '2px solid #e0f2fe',
                borderRadius: '12px',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 153, 204, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 153, 204, 0.08)';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                  {useCase.icon}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0099cc', marginBottom: '12px' }}>
                  {useCase.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                  {useCase.description}
                </p>
                <div>
                  {useCase.benefits.map((benefit, i) => (
                    <div key={i} style={{ fontSize: '13px', color: '#0077aa', marginBottom: '8px' }}>
                      ✓ {benefit}
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* CTA */}
      <div style={{
        padding: '60px 40px',
        background: 'linear-gradient(135deg, #0099cc 0%, #0077aa 100%)',
        textAlign: 'center',
        color: '#ffffff'
      }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '20px' }}>
          Sẵn Sàng Trải Nghiệm?
        </h2>
        <Button
          type="primary"
          size="large"
          onClick={() => navigate('/superadmin/register')}
          style={{
            background: '#ffffff',
            color: '#0099cc',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            height: '48px'
          }}
        >
          Đăng Ký Miễn Phí <ArrowRightOutlined />
        </Button>
      </div>

      {/* Footer */}
      <div style={{
        padding: '40px',
        background: '#1e3a8a',
        color: '#a5f3fc',
        textAlign: 'center'
      }}>
        <p style={{ marginBottom: '8px' }}>
          © 2025 Healthcare System
        </p>
      </div>
    </div>
  );
};

export default FeaturesPage;
