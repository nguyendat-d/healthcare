import React from 'react';
import { Button, Row, Col, Card, Space, Table, Tabs } from 'antd';
import { CheckOutlined, CloseOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const PricingPage = () => {
  const navigate = useNavigate();

  const pricingPlans = [
    {
      name: 'Khởi Động',
      price: '3,990,000',
      period: '/năm',
      description: 'Dành cho phòng khám nhỏ',
      users: 'Đến 50 người dùng',
      features: [
        { name: 'Quản lý bệnh nhân cơ bản', included: true },
        { name: 'Lịch hẹn đơn giản', included: true },
        { name: 'Báo cáo cơ bản', included: true },
        { name: 'Support email', included: true },
        { name: 'Backup hàng ngày', included: true },
        { name: 'Multi-location', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'API access', included: false }
      ],
      popular: false
    },
    {
      name: 'Chuyên Nghiệp',
      price: '9,990,000',
      period: '/năm',
      description: 'Cho bệnh viện trung bình',
      users: 'Đến 500 người dùng',
      features: [
        { name: 'Quản lý bệnh nhân cơ bản', included: true },
        { name: 'Lịch hẹn đơn giản', included: true },
        { name: 'Báo cáo cơ bản', included: true },
        { name: 'Support email', included: true },
        { name: 'Backup hàng ngày', included: true },
        { name: 'Multi-location', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'API access', included: true }
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Tùy Chỉnh',
      period: '',
      description: 'Cho bệnh viện lớn',
      users: 'Người dùng không giới hạn',
      features: [
        { name: 'Quản lý bệnh nhân cơ bản', included: true },
        { name: 'Lịch hẹn đơn giản', included: true },
        { name: 'Báo cáo cơ bản', included: true },
        { name: 'Support email', included: true },
        { name: 'Backup hàng ngày', included: true },
        { name: 'Multi-location', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'API access', included: true }
      ],
      popular: false
    }
  ];

  const comparisonColumns = [
    {
      title: 'Tính Năng',
      dataIndex: 'feature',
      key: 'feature',
      width: 300,
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Khởi Động',
      dataIndex: 'starter',
      key: 'starter',
      align: 'center',
      render: (included) => included ? <CheckOutlined style={{ color: '#10b981', fontSize: '18px' }} /> : <CloseOutlined style={{ color: '#ef4444', fontSize: '18px' }} />
    },
    {
      title: 'Chuyên Nghiệp',
      dataIndex: 'professional',
      key: 'professional',
      align: 'center',
      render: (included) => included ? <CheckOutlined style={{ color: '#10b981', fontSize: '18px' }} /> : <CloseOutlined style={{ color: '#ef4444', fontSize: '18px' }} />
    },
    {
      title: 'Enterprise',
      dataIndex: 'enterprise',
      key: 'enterprise',
      align: 'center',
      render: (included) => included ? <CheckOutlined style={{ color: '#10b981', fontSize: '18px' }} /> : <CloseOutlined style={{ color: '#ef4444', fontSize: '18px' }} />
    }
  ];

  const comparisonData = [
    { key: 1, feature: 'Số người dùng', starter: '50', professional: '500', enterprise: 'Unlimited' },
    { key: 2, feature: 'Quản lý bệnh nhân', starter: true, professional: true, enterprise: true },
    { key: 3, feature: 'Lịch hẹn & SMS', starter: true, professional: true, enterprise: true },
    { key: 4, feature: 'Báo cáo', starter: true, professional: true, enterprise: true },
    { key: 5, feature: 'Multi-location', starter: false, professional: true, enterprise: true },
    { key: 6, feature: 'Advanced Analytics', starter: false, professional: true, enterprise: true },
    { key: 7, feature: 'API Access', starter: false, professional: true, enterprise: true },
    { key: 8, feature: 'Dedicated Support', starter: false, professional: false, enterprise: true },
    { key: 9, feature: 'Custom Integration', starter: false, professional: false, enterprise: true },
    { key: 10, feature: 'On-premise Option', starter: false, professional: false, enterprise: true }
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
          <Button type="text" onClick={() => navigate('/features')} style={{ color: '#0099cc' }}>
            Tính Năng
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
          Bảng Giá Minh Bạch
        </h1>
        <p style={{ fontSize: '18px', color: '#a5f3fc', maxWidth: '600px', margin: '0 auto' }}>
          Chọn gói phù hợp với quy mô và nhu cầu của bệnh viện bạn
        </p>
      </div>

      {/* Pricing Cards */}
      <div style={{ padding: '80px 40px', background: '#f8fdfb' }}>
        <Row gutter={[24, 24]}>
          {pricingPlans.map((plan, index) => (
            <Col xs={24} md={8} key={index}>
              <Card
                style={{
                  border: plan.popular ? '2px solid #0099cc' : '1px solid #e0f2fe',
                  borderRadius: '16px',
                  background: plan.popular ? 'linear-gradient(135deg, #f8fdfb 0%, #ffffff 100%)' : '#ffffff',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  position: 'relative',
                  boxShadow: plan.popular ? '0 16px 32px rgba(0, 153, 204, 0.2)' : '0 2px 8px rgba(0, 153, 204, 0.08)',
                  transform: plan.popular ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #0099cc 0%, #0077aa 100%)',
                    color: '#ffffff',
                    padding: '4px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    ⭐ MỚI PHỔ BIẾN
                  </div>
                )}
                <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#0099cc', marginBottom: '8px' }}>
                  {plan.name}
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                  {plan.description}
                </p>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '36px', fontWeight: '800', color: '#0099cc' }}>
                    {plan.price}
                    <span style={{ fontSize: '16px', color: '#0077aa' }}>{plan.period}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
                    {plan.users}
                  </div>
                </div>
                <Button
                  type={plan.popular ? 'primary' : 'default'}
                  block
                  size="large"
                  onClick={() => navigate('/superadmin/register')}
                  style={{
                    marginBottom: '24px',
                    background: plan.popular ? 'linear-gradient(135deg, #0099cc 0%, #0077aa 100%)' : undefined,
                    border: plan.popular ? 'none' : '1px solid #0099cc',
                    color: plan.popular ? '#ffffff' : '#0099cc'
                  }}
                >
                  Chọn Gói
                </Button>
                <div style={{ fontSize: '13px' }}>
                  {plan.features.map((feature, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <CheckOutlined style={{ color: '#10b981', marginRight: '10px', marginTop: '2px', fontWeight: 'bold' }} />
                      <span style={{ color: '#1e293b' }}>{feature.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Comparison Table */}
      <div style={{ padding: '80px 40px', background: '#ffffff' }}>
        <h2 style={{
          fontSize: '40px',
          fontWeight: '800',
          color: '#0099cc',
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          📊 So Sánh Chi Tiết
        </h2>
        <Table
          columns={comparisonColumns}
          dataSource={comparisonData}
          pagination={false}
          style={{ background: '#ffffff' }}
          bordered
        />
      </div>

      {/* FAQ */}
      <div style={{ padding: '80px 40px', background: '#f8fdfb' }}>
        <h2 style={{
          fontSize: '40px',
          fontWeight: '800',
          color: '#0099cc',
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          ❓ FAQ về Pricing
        </h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card style={{ border: '1px solid #e0f2fe', borderRadius: '12px' }}>
              <h4 style={{ color: '#0099cc', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
                Có hợp đồng dài hạn không?
              </h4>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                Chúng tôi cung cấp hợp đồng 1 năm hoặc 3 năm với giá tốt hơn. Liên hệ sales để biết chi tiết.
              </p>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card style={{ border: '1px solid #e0f2fe', borderRadius: '12px' }}>
              <h4 style={{ color: '#0099cc', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
                Có thể thay đổi gói không?
              </h4>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                Có, bạn có thể nâng cấp hoặc hạ cấp gói bất kỳ lúc nào. Chúng tôi sẽ tính toán lại giá theo tỷ lệ.
              </p>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card style={{ border: '1px solid #e0f2fe', borderRadius: '12px' }}>
              <h4 style={{ color: '#0099cc', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
                Giá có bao gồm support không?
              </h4>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                Email support bao gồm ở tất cả gói. Support phone/chat thêm $500/tháng cho gói Starter.
              </p>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card style={{ border: '1px solid #e0f2fe', borderRadius: '12px' }}>
              <h4 style={{ color: '#0099cc', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
                Có free trial không?
              </h4>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                Có, chúng tôi cung cấp 30 ngày free trial cho gói Professional. Không cần thẻ tín dụng.
              </p>
            </Card>
          </Col>
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
          Bắt Đầu Miễn Phí Ngay Hôm Nay
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
          Đăng Ký 30 Ngày Free <ArrowRightOutlined />
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

export default PricingPage;
