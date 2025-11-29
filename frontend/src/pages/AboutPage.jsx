import React from 'react';
import { Button, Row, Col, Card, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const AboutPage = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: 'Dr. Võ Văn Luận',
      role: 'CEO & Founder',
      expertise: 'Healthcare Architecture',
      image: '👨‍💼',
      bio: '15+ năm kinh nghiệm trong IT Healthcare'
    },
    {
      name: 'Nguyễn Phước Đại',
      role: 'CTO',
      expertise: 'Full-stack Development',
      image: '👨‍💻',
      bio: '10+ năm phát triển các hệ thống lớn'
    },
    {
      name: 'Dr. Trần Thị Hương',
      role: 'Medical Advisor',
      expertise: 'Healthcare Compliance',
      image: '👩‍⚕️',
      bio: 'Bác sĩ chuyên khoa với 20+ năm kinh nghiệm'
    },
    {
      name: 'Lê Văn Minh',
      role: 'Head of Support',
      expertise: 'Customer Success',
      image: '👨‍🎓',
      bio: 'Hỗ trợ khách hàng 24/7 chuyên nghiệp'
    }
  ];

  const techStack = [
    { icon: '⚛️', name: 'React 18', desc: 'Frontend modern' },
    { icon: '🟢', name: 'Node.js', desc: 'Backend runtime' },
    { icon: '📦', name: 'MongoDB', desc: 'Database NoSQL' },
    { icon: '🔑', name: 'JWT', desc: 'Authentication' },
    { icon: '🐳', name: 'Docker', desc: 'Containerization' },
    { icon: '☁️', name: 'AWS', desc: 'Cloud hosting' }
  ];

  const certifications = [
    { icon: '✅', name: 'ISO 27001', desc: 'Information Security' },
    { icon: '🏥', name: 'HIPAA', desc: 'Healthcare Compliance' },
    { icon: '🔐', name: 'SOC 2', desc: 'Security & Availability' },
    { icon: '📋', name: 'GDPR', desc: 'Data Protection' }
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
          Về Healthcare System
        </h1>
        <p style={{ fontSize: '18px', color: '#a5f3fc', maxWidth: '700px', margin: '0 auto' }}>
          Nền tảng quản lý y tế hàng đầu được tin cậy bởi hơn 50 bệnh viện
        </p>
      </div>

      {/* Team Section */}
      <div style={{ padding: '80px 40px', background: '#f8fdfb' }}>
        <h2 style={{ fontSize: '44px', fontWeight: '800', color: '#0099cc', textAlign: 'center', marginBottom: '60px' }}>
          👥 Đội Ngũ Chuyên Gia
        </h2>
        <Row gutter={[24, 24]}>
          {teamMembers.map((member, idx) => (
            <Col xs={24} sm={12} md={6} key={idx}>
              <Card style={{
                border: '1px solid #e0f2fe',
                borderRadius: '12px',
                textAlign: 'center',
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
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>{member.image}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0099cc', marginBottom: '4px' }}>
                  {member.name}
                </h3>
                <p style={{ fontSize: '14px', color: '#0077aa', fontWeight: '600', marginBottom: '8px' }}>
                  {member.role}
                </p>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', fontStyle: 'italic' }}>
                  {member.expertise}
                </p>
                <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                  {member.bio}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Tech Stack */}
      <div style={{ padding: '80px 40px', background: '#ffffff' }}>
        <h2 style={{ fontSize: '44px', fontWeight: '800', color: '#0099cc', textAlign: 'center', marginBottom: '60px' }}>
          🛠️ Công Nghệ Sử Dụng
        </h2>
        <Row gutter={[24, 24]}>
          {techStack.map((tech, idx) => (
            <Col xs={24} sm={12} md={4} key={idx}>
              <Card style={{
                border: '1px solid #e0f2fe',
                borderRadius: '12px',
                textAlign: 'center',
                background: '#f8fdfb'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{tech.icon}</div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0099cc', marginBottom: '8px' }}>
                  {tech.name}
                </h4>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  {tech.desc}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Certifications */}
      <div style={{ padding: '80px 40px', background: '#f8fdfb' }}>
        <h2 style={{ fontSize: '44px', fontWeight: '800', color: '#0099cc', textAlign: 'center', marginBottom: '60px' }}>
          🔐 Chứng Chỉ & Tuân Thủ
        </h2>
        <Row gutter={[24, 24]}>
          {certifications.map((cert, idx) => (
            <Col xs={24} sm={12} md={6} key={idx}>
              <Card style={{
                border: '2px solid #10b981',
                borderRadius: '12px',
                textAlign: 'center',
                background: '#f0fdf4'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{cert.icon}</div>
                <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#0099cc', marginBottom: '8px' }}>
                  {cert.name}
                </h4>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  {cert.desc}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
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

export default AboutPage;
