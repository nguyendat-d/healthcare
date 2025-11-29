import React from 'react';
import { Button, Row, Col, Card, Space } from 'antd';
import { ArrowLeftOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const CustomersPage = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      name: 'Dr. Nguyễn Văn A',
      role: 'Bác Sĩ Tim Mạch',
      hospital: 'Bệnh Viện Đại Học Y Hà Nội',
      image: '👨‍⚕️',
      content: 'Hệ thống giúp tôi tiết kiệm 3 giờ/ngày, có thể tập trung vào bệnh nhân hơn. Rất hài lòng với chất lượng.',
      rating: 5
    },
    {
      name: 'Ms. Trần Thị B',
      role: 'Quản Lý Bệnh Viện',
      hospital: 'Bệnh Viện Chợ Rẫy',
      image: '👩‍💼',
      content: 'Hiệu suất tăng 40%, bệnh nhân rất hài lòng với quy trình nhanh hơn. Đầu tư rất xứng đáng.',
      rating: 5
    },
    {
      name: 'Mr. Lê Văn C',
      role: 'Giám Đốc IT',
      hospital: 'Bệnh Viện 108',
      image: '👨‍💻',
      content: 'Triển khai dễ dàng, support team rất chuyên nghiệp. Strongly recommend!',
      rating: 5
    },
    {
      name: 'Dr. Phạm Thị D',
      role: 'Bác Sĩ Ngoại',
      hospital: 'Bệnh Viện Việt Đức',
      image: '👨‍⚕️',
      content: 'Giao diện thân thiện, dễ sử dụng ngay từ lần đầu tiên. Team hỗ trợ rất tuyệt vời.',
      rating: 5
    },
    {
      name: 'Mr. Vũ Văn E',
      role: 'Trưởng Phòng Y Tế',
      hospital: 'Bệnh Viện Bạch Mai',
      image: '👨‍💼',
      content: 'Quản lý hồ sơ y tế dễ dàng hơn bao giờ hết. Tiết kiệm chi phí vận hành đáng kể.',
      rating: 5
    },
    {
      name: 'Dr. Hồ Thị F',
      role: 'Bác Sĩ Nhi',
      hospital: 'Bệnh Viện Nhi Đồng 1',
      image: '👩‍⚕️',
      content: 'Hệ thống bảo mật vô cùng chặt chẽ, tôi yên tâm về dữ liệu bệnh nhân.',
      rating: 5
    }
  ];

  const partners = [
    { 
      name: 'MongoDB', 
      logo: '🔵', 
      category: 'Database',
      description: 'Cơ sở dữ liệu NoSQL hiệu suất cao'
    },
    { 
      name: 'AWS', 
      logo: '☁️', 
      category: 'Cloud',
      description: 'Dịch vụ cloud đáng tin cậy'
    },
    { 
      name: 'Stripe', 
      logo: '💳', 
      category: 'Payment',
      description: 'Thanh toán trực tuyến an toàn'
    },
    { 
      name: 'Twilio', 
      logo: '📱', 
      category: 'SMS/Email',
      description: 'Dịch vụ SMS và email'
    },
    { 
      name: 'Auth0', 
      logo: '🔐', 
      category: 'Security',
      description: 'Xác thực và bảo mật'
    },
    { 
      name: 'Docker', 
      logo: '🐳', 
      category: 'DevOps',
      description: 'Container orchestration'
    }
  ];

  const stats = [
    { number: '50+', label: 'Bệnh Viện & Phòng Khám' },
    { number: '15,000+', label: 'Người Dùng Tích Cực' },
    { number: '500K+', label: 'Hồ Sơ Bệnh Nhân' },
    { number: '99.9%', label: 'Uptime' }
  ];

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#ffffff' }}>
      {/* Header */}
      <div style={{
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
      }}>
        <Logo size="medium" showText={true} />
        <Button 
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          style={{ color: '#0099cc', fontSize: '16px' }}
        >
          Quay Lại
        </Button>
      </div>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0099cc 0%, #0077aa 100%)',
        padding: '60px 40px',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '44px', fontWeight: '900', marginBottom: '20px' }}>
          Khách Hàng & Đối Tác
        </h1>
        <p style={{ fontSize: '18px', color: '#a5f3fc', maxWidth: '700px', margin: '0 auto' }}>
          Được tin cậy bởi các bệnh viện hàng đầu và các công ty công nghệ lớn
        </p>
      </div>

      {/* Statistics */}
      <div style={{ padding: '60px 40px', background: '#f8fdfb' }}>
        <Row gutter={[32, 32]}>
          {stats.map((stat, idx) => (
            <Col xs={24} sm={12} md={6} key={idx}>
              <Card style={{
                border: '2px solid #a5f3fc',
                borderRadius: '12px',
                textAlign: 'center',
                background: '#ffffff'
              }}>
                <div style={{ fontSize: '36px', fontWeight: '800', color: '#0099cc', marginBottom: '12px' }}>
                  {stat.number}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  {stat.label}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Testimonials */}
      <div style={{ padding: '80px 40px', background: '#ffffff' }}>
        <h2 style={{ fontSize: '44px', fontWeight: '800', color: '#0099cc', textAlign: 'center', marginBottom: '60px' }}>
          ⭐ Phản Hồi Từ Khách Hàng
        </h2>
        <Row gutter={[24, 24]}>
          {testimonials.map((testimonial, index) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <Card
                style={{
                  border: '1px solid #a5f3fc',
                  borderRadius: '12px',
                  background: '#ffffff',
                  transition: 'all 0.3s ease',
                  height: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 153, 204, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 153, 204, 0.08)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarOutlined key={i} style={{ color: '#fbbf24', fontSize: '18px', marginRight: '4px' }} />
                  ))}
                </div>
                <p style={{ fontSize: '16px', color: '#1e293b', marginBottom: '20px', fontStyle: 'italic', lineHeight: '1.6' }}>
                  "{testimonial.content}"
                </p>
                <div style={{ borderTop: '1px solid #e0f2fe', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '40px', marginRight: '12px' }}>
                      {testimonial.image}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: '#0099cc', margin: '0' }}>
                        {testimonial.name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#0077aa', margin: '0' }}>
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '8px 0 0 0' }}>
                    {testimonial.hospital}
                  </p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Partners */}
      <div style={{ padding: '80px 40px', background: '#f8fdfb' }}>
        <h2 style={{ fontSize: '44px', fontWeight: '800', color: '#0099cc', textAlign: 'center', marginBottom: '20px' }}>
          🤝 Đối Tác Tin Cậy
        </h2>
        <p style={{ fontSize: '16px', color: '#0077aa', textAlign: 'center', marginBottom: '60px' }}>
          Tích hợp với các nền tảng hàng đầu thế giới
        </p>
        <Row gutter={[32, 32]}>
          {partners.map((partner, idx) => (
            <Col xs={12} sm={8} md={4} key={idx}>
              <Card style={{
                border: '2px solid #a5f3fc',
                borderRadius: '12px',
                textAlign: 'center',
                background: '#ffffff',
                transition: 'all 0.3s ease',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 153, 204, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 153, 204, 0.08)';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{partner.logo}</div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0099cc', marginBottom: '4px' }}>
                  {partner.name}
                </h4>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                  {partner.category}
                </p>
                <p style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                  {partner.description}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* CTA */}
      <div style={{
        padding: '60px 40px',
        background: 'linear-gradient(135deg, #0099cc 0%, #0077aa 100%)',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '20px' }}>
          Sẵn Sàng Tham Gia Với Chúng Tôi?
        </h2>
        <p style={{ fontSize: '18px', color: '#a5f3fc', marginBottom: '30px' }}>
          Bắt đầu dùng thử miễn phí ngay hôm nay
        </p>
        <Button 
          type="primary"
          size="large"
          onClick={() => navigate('/superadmin/register')}
          style={{
            background: '#ffffff',
            color: '#0099cc',
            border: 'none',
            height: '56px',
            fontSize: '18px',
            fontWeight: '600'
          }}
        >
          Đăng Ký Miễn Phí
        </Button>
      </div>

      {/* Footer */}
      <div style={{ padding: '40px', background: '#1e3a8a', color: '#a5f3fc', textAlign: 'center' }}>
        <p style={{ marginBottom: '0' }}>
          © 2025 Healthcare System - Hệ Thống Quản Lý Y Tế Hiện Đại
        </p>
      </div>
    </div>
  );
};

export default CustomersPage;
