import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Card, Space, Collapse, Input, Form, message, Badge, Tooltip } from 'antd';
import { 
  SafetyOutlined, 
  TeamOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  ArrowRightOutlined,
  LockOutlined,
  FileOutlined,
  BarChartOutlined,
  PhoneOutlined,
  MailOutlined,
  LinkedinOutlined,
  FacebookOutlined,
  TwitterOutlined,
  StarOutlined,
  CheckOutlined,
  CalendarOutlined,
  PlayCircleOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  HeartOutlined,
  SafetyCertificateOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import '../styles/animations.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [contactForm] = Form.useForm();
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <LockOutlined style={{ fontSize: '48px', color: '#0099cc' }} />,
      title: 'Bảo Mật Tối Đa',
      description: 'Mã hóa end-to-end, bảo vệ HIPAA, audit logs đầy đủ',
      details: ['Encryption AES-256', 'HIPAA Compliant', 'Data Backup 24/7']
    },
    {
      icon: <TeamOutlined style={{ fontSize: '48px', color: '#0077aa' }} />,
      title: 'Quản Lý Đa Vai Trò',
      description: '6 vai trò với quyền hạn chi tiết: Admin, Bác sĩ, Bệnh nhân...',
      details: ['RBAC Advanced', 'Workflow Tùy Chỉnh', 'Permission Control']
    },
    {
      icon: <FileOutlined style={{ fontSize: '48px', color: '#0099cc' }} />,
      title: 'Hồ Sơ Y Tế Toàn Diện',
      description: 'Lịch hẹn, đơn thuốc, xét nghiệm, hóa đơn - tất cả trên một nền tảng',
      details: ['Appointments', 'Prescriptions', 'Lab Orders']
    },
    {
      icon: <BarChartOutlined style={{ fontSize: '48px', color: '#06b6d4' }} />,
      title: 'Analytics & Reporting',
      description: 'Dashboard trực quan, báo cáo chi tiết, xuất dữ liệu tự động',
      details: ['Real-time Dashboard', 'Custom Reports', 'Data Export']
    },
    {
      icon: <CalendarOutlined style={{ fontSize: '48px', color: '#0099cc' }} />,
      title: 'Tích Hợp Lịch Hẹn',
      description: 'Đặt lịch tự động, nhắc nhở qua email/SMS, quản lý phòng khám',
      details: ['Auto Scheduling', 'Notifications', 'Clinic Management']
    },
    {
      icon: <CheckCircleOutlined style={{ fontSize: '48px', color: '#0077aa' }} />,
      title: 'Kiểm Soát Chất Lượng',
      description: 'Audit logs, version control, compliance tracking',
      details: ['Full Audit Trail', 'Version Control', 'Compliance']
    }
  ];

  const benefits = [
    {
      title: 'Cho Bệnh Viện',
      icon: '🏥',
      items: [
        'Tăng hiệu suất lên 40%',
        'Giảm lỗi y tế 60%',
        'Quản lý bệnh nhân dễ dàng',
        'Báo cáo tự động'
      ]
    },
    {
      title: 'Cho Bác Sĩ',
      icon: '👨‍⚕️',
      items: [
        'Truy cập nhanh hồ sơ',
        'Giảm giấy tờ 80%',
        'Tập trung vào bệnh nhân',
        'Theo dõi ca bệnh dễ'
      ]
    },
    {
      title: 'Cho Bệnh Nhân',
      icon: '👥',
      items: [
        'Đặt lịch online 24/7',
        'Xem hồ sơ bất kỳ lúc nào',
        'Nhận thông báo tự động',
        'Thanh toán trực tuyến an toàn'
      ]
    }
  ];

  const pricingPlans = [
    {
      name: 'Khởi Động',
      price: '3,990,000',
      period: '/năm',
      description: 'Dành cho phòng khám nhỏ',
      users: 'Đến 50 người dùng',
      features: [
        'Quản lý bệnh nhân cơ bản',
        'Lịch hẹn đơn giản',
        'Báo cáo cơ bản',
        'Support email',
        'Backup hàng ngày'
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
        'Tất cả của gói Khởi Động',
        'Quản lý bác sĩ nâng cao',
        'Phân tích dữ liệu',
        'Support priority',
        'Custom branding',
        'API access'
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
        'Tất cả của gói Chuyên Nghiệp',
        'Dedicated support 24/7',
        'Custom integration',
        'On-premise option',
        'Advanced security',
        'Training & consulting'
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Nguyễn Văn A',
      role: 'Bác Sĩ Tim Mạch',
      hospital: 'Bệnh Viện Đại Học Y Hà Nội',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      content: 'Hệ thống giúp tôi tiết kiệm 3 giờ/ngày, có thể tập trung vào bệnh nhân hơn.',
      rating: 5
    },
    {
      name: 'Ms. Trần Thị B',
      role: 'Quản Lý Bệnh Viện',
      hospital: 'Bệnh Viện Chợ Rẫy',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face',
      content: 'Hiệu suất tăng 40%, bệnh nhân rất hài lòng với quy trình nhanh hơn.',
      rating: 5
    },
    {
      name: 'Mr. Lê Văn C',
      role: 'Giám Đốc IT',
      hospital: 'Bệnh Viện 108',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: 'Triển khai dễ dàng, support team rất chuyên nghiệp. Strongly recommend!',
      rating: 5
    }
  ];

  const faqItems = [
    {
      key: '1',
      label: '💳 Có hỗ trợ thanh toán nào không?',
      children: 'Chúng tôi hỗ trợ thanh toán qua thẻ tín dụng, chuyển khoản ngân hàng, và các phương thức thanh toán điện tử khác. Bạn có thể theo dõi hóa đơn trong hệ thống.'
    },
    {
      key: '2',
      label: '🔒 Dữ liệu bệnh nhân có an toàn không?',
      children: 'Có, dữ liệu được mã hóa AES-256, lưu trữ trên máy chủ an toàn, tuân thủ HIPAA và các quy định bảo vệ dữ liệu quốc tế.'
    },
    {
      key: '3',
      label: '⏰ Có hỗ trợ 24/7 không?',
      children: 'Có, team support của chúng tôi sẵn sàng 24/7 để giúp bạn. Bạn có thể liên hệ qua email, phone, hoặc live chat.'
    },
    {
      key: '4',
      label: '📱 Có app mobile không?',
      children: 'Hiện tại chúng tôi cung cấp web app responsive hoàn toàn. Native mobile apps sắp được phát hành vào Q1 2026.'
    },
    {
      key: '5',
      label: '🔄 Có hỗ trợ migrate dữ liệu cũ không?',
      children: 'Có, team chúng tôi sẽ hỗ trợ migrate dữ liệu từ hệ thống cũ với chi phí tùy theo quy mô.'
    },
    {
      key: '6',
      label: '🎓 Có đào tạo staff không?',
      children: 'Có, chúng tôi cung cấp training online hoặc on-site tuỳ gói. Tài liệu và video hướng dẫn có sẵn trong tiếng Việt.'
    }
  ];

  const teamMembers = [
    {
      name: 'Dr. Võ Văn Luận',
      role: 'CEO & Founder',
      expertise: 'Healthcare Architecture',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
      bio: '15+ năm kinh nghiệm trong IT Healthcare'
    },
    {
      name: 'Nguyễn Phước Đại',
      role: 'CTO',
      expertise: 'Full-stack Development',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
      bio: '10+ năm phát triển các hệ thống lớn'
    },
    {
      name: 'Dr. Trần Thị Hương',
      role: 'Medical Advisor',
      expertise: 'Healthcare Compliance',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
      bio: 'Bác sĩ chuyên khoa với 20+ năm kinh nghiệm'
    },
    {
      name: 'phai niê',
      role: 'Head of Support',
      expertise: 'Customer Success',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      bio: 'Hỗ trợ khách hàng 24/7 chuyên nghiệp'
    }
  ];

  const partners = [
    { name: 'MongoDB', logo: '🔵', category: 'Database' },
    { name: 'AWS', logo: '☁️', category: 'Cloud' },
    { name: 'Stripe', logo: '💳', category: 'Payment' },
    { name: 'Twilio', logo: '📱', category: 'SMS/Email' },
    { name: 'Auth0', logo: '🔐', category: 'Security' },
    { name: 'Docker', logo: '🐳', category: 'DevOps' }
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

  const blogPosts = [
    {
      date: '24/11/2025',
      category: 'Tips',
      title: 'Cách tối ưu hóa quy trình quản lý bệnh nhân',
      excerpt: 'Khám phá những cách tốt nhất để tăng hiệu suất công việc...',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop'
    },
    {
      date: '20/11/2025',
      category: 'Security',
      title: 'Bảo mật dữ liệu y tế - những điều cần biết',
      excerpt: 'Hiểu rõ hơn về cách chúng tôi bảo vệ dữ liệu của bạn...',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=250&fit=crop'
    },
    {
      date: '15/11/2025',
      category: 'Case Study',
      title: 'Bệnh viện X tăng hiệu suất 40% với Healthcare System',
      excerpt: 'Tìm hiểu câu chuyện thành công của một bệnh viện lớn...',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=250&fit=crop'
    }
  ];

  const achievements = [
    { number: '50+', label: 'Bệnh Viện / Phòng Khám', icon: '🏥' },
    { number: '15K+', label: 'Người Dùng Tích Cực', icon: '👥' },
    { number: '500K+', label: 'Hồ Sơ Bệnh Nhân', icon: '📋' },
    { number: '99.9%', label: 'Uptime Guarantee', icon: '⚡' },
    { number: '24/7', label: 'Support Team', icon: '📞' },
    { number: '10ms', label: 'Avg Response Time', icon: '⚙️' }
  ];

  const handleContactSubmit = (values) => {
    message.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.');
    contactForm.resetFields();
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#ffffff' }}>
      {/* ===== STICKY HEADER ===== */}
      <div 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: '#ffffff',
          padding: '16px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderBottom: '1px solid #f0f0f0'
        }}
      >
        <Logo size="medium" showText={true} />
        <Space size={24} style={{ flex: 1, justifyContent: 'center' }}>
          {[
            { label: 'Trang Chủ', path: '/' },
            { label: 'Tính Năng', path: '/features' },
            { label: 'Giá Cả', path: '/pricing' },
            { label: 'Về Chúng Tôi', path: '/about' },
            { label: 'Blog', path: '/blog' },
            { label: 'Khách Hàng', path: '/customers' }
          ].map((item) => (
            <Button 
              key={item.path}
              type="text"
              onClick={() => navigate(item.path)}
              style={{ 
                color: '#000000', 
                fontSize: '14px', 
                fontWeight: '500',
                padding: '8px 12px',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#0099cc';
                e.currentTarget.style.background = '#f5f5f5';
                e.currentTarget.style.borderRadius = '4px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#000000';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {item.label}
            </Button>
          ))}
        </Space>
        <Space size="middle">
          <Button 
            type="text"
            onClick={() => navigate('/superadmin/login')}
            style={{ 
              color: '#000000', 
              fontSize: '14px', 
              fontWeight: '500',
              padding: '8px 12px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0099cc';
              e.currentTarget.style.background = '#f5f5f5';
              e.currentTarget.style.borderRadius = '4px';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#000000';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Đăng Nhập
          </Button>
          <Button 
            type="primary"
            size="small"
            onClick={() => navigate('/superadmin/register')}
            style={{
              background: 'linear-gradient(135deg, #0099cc 0%, #0077aa 100%)',
              border: 'none',
              fontWeight: '600',
              fontSize: '13px',
              height: '36px',
              paddingLeft: '20px',
              paddingRight: '20px',
              boxShadow: '0 4px 15px rgba(0, 153, 204, 0.4)'
            }}
          >
            🚀 Đăng Ký Ngay
          </Button>
        </Space>
      </div>

      {/* ===== HERO SECTION - ULTRA PREMIUM ===== */}
      <div
        style={{
          background: `linear-gradient(135deg, rgba(0, 40, 80, 0.97) 0%, rgba(0, 80, 130, 0.95) 30%, rgba(0, 153, 204, 0.9) 70%, rgba(6, 182, 212, 0.85) 100%), url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          padding: '140px 40px 120px',
          textAlign: 'center',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Animated Background Particles */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        {/* Glowing Orbs */}
        <div style={{ 
          position: 'absolute', 
          width: '600px', 
          height: '600px', 
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)', 
          top: '-200px', 
          right: '-200px',
          animation: 'pulse 8s ease-in-out infinite'
        }} />
        <div style={{ 
          position: 'absolute', 
          width: '400px', 
          height: '400px', 
          background: 'radial-gradient(circle, rgba(0, 153, 204, 0.25) 0%, transparent 70%)', 
          bottom: '-100px', 
          left: '-100px',
          animation: 'pulse 10s ease-in-out infinite 2s'
        }} />

        {/* Floating Medical Icons */}
        <div style={{ position: 'absolute', opacity: 0.08, fontSize: '250px', top: '5%', left: '2%', animation: 'float 8s ease-in-out infinite', transform: `translateY(${scrollY * 0.1}px)` }}>💊</div>
        <div style={{ position: 'absolute', opacity: 0.06, fontSize: '200px', bottom: '5%', right: '5%', animation: 'float 10s ease-in-out infinite 1s', transform: `translateY(${scrollY * -0.05}px)` }}>🩺</div>
        <div style={{ position: 'absolute', opacity: 0.05, fontSize: '180px', top: '15%', right: '10%', animation: 'float 9s ease-in-out infinite 0.5s' }}>❤️</div>
        <div style={{ position: 'absolute', opacity: 0.04, fontSize: '150px', bottom: '20%', left: '8%', animation: 'float 11s ease-in-out infinite 2s' }}>🏥</div>
        <div style={{ position: 'absolute', opacity: 0.05, fontSize: '120px', top: '40%', left: '15%', animation: 'float 7s ease-in-out infinite 1.5s' }}>💉</div>

        {/* Trust Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          padding: '8px 20px',
          borderRadius: '50px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          animation: 'fadeInDown 0.8s ease-out'
        }}>
          <SafetyCertificateOutlined style={{ color: '#10b981', fontSize: '18px' }} />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Được tin dùng bởi 50+ Bệnh viện hàng đầu Việt Nam</span>
        </div>
        
        <h1 style={{ 
          fontSize: '72px', 
          fontWeight: '900', 
          marginBottom: '24px',
          lineHeight: '1.1',
          animation: 'fadeInUp 0.8s ease-out',
          textShadow: '0 4px 30px rgba(0,0,0,0.4)',
          letterSpacing: '-1px',
          maxWidth: '1000px'
        }}>
          Nền Tảng Y Tế Số <br /> 
          <span style={{ 
            background: 'linear-gradient(90deg, #a5f3fc 0%, #67e8f9 50%, #22d3ee 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Thông Minh & Toàn Diện</span>
        </h1>
        <p style={{ 
          fontSize: '22px', 
          color: 'rgba(255, 255, 255, 0.9)',
          marginBottom: '50px',
          maxWidth: '800px',
          margin: '0 auto 40px',
          lineHeight: '1.8',
          animation: 'fadeInUp 0.8s ease-out 0.2s both'
        }}>
          Số hóa toàn bộ quy trình y tế với công nghệ AI tiên tiến. Tăng hiệu suất <strong style={{ color: '#22d3ee' }}>40%</strong>, 
          giảm lỗi <strong style={{ color: '#22d3ee' }}>60%</strong>, tiết kiệm chi phí <strong style={{ color: '#22d3ee' }}>30%</strong>
        </p>

        {/* Feature Pills */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          marginBottom: '40px',
          animation: 'fadeInUp 0.8s ease-out 0.3s both'
        }}>
          {['🔒 Bảo mật HIPAA', '⚡ Realtime', '🤖 AI Powered', '📱 Responsive'].map((pill, i) => (
            <span key={i} style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(5px)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>{pill}</span>
          ))}
        </div>

        <Space size="large" wrap style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}>
          <Button 
            type="primary"
            size="large"
            onClick={() => navigate('/superadmin/register')}
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
              color: '#0077aa',
              border: 'none',
              height: '60px',
              fontSize: '18px',
              fontWeight: '700',
              padding: '0 40px',
              borderRadius: '30px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.2)';
            }}
          >
            <RocketOutlined style={{ marginRight: '8px' }} /> Bắt Đầu Miễn Phí
          </Button>
          <Button 
            size="large"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              height: '60px',
              fontSize: '18px',
              padding: '0 40px',
              borderRadius: '30px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
          >
            <PlayCircleOutlined style={{ marginRight: '8px' }} /> Xem Demo
          </Button>
        </Space>

        {/* Social Proof Stats - Glass morphism */}
        <Row gutter={[24, 24]} style={{ marginTop: '80px', maxWidth: '1200px', margin: '80px auto 0' }}>
          {[
            { number: '50+', label: 'Bệnh Viện / Phòng Khám', icon: '🏥' },
            { number: '15K+', label: 'Người Dùng Tích Cực', icon: '👥' },
            { number: '500K+', label: 'Hồ Sơ Bệnh Nhân', icon: '📋' },
            { number: '99.9%', label: 'Uptime Guarantee', icon: '⚡' }
          ].map((stat, idx) => (
            <Col xs={12} sm={12} md={6} key={idx}>
              <div 
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '24px 16px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  animation: `fadeInUp 0.8s ease-out ${0.6 + idx * 0.15}s both`,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '4px', background: 'linear-gradient(180deg, #fff 0%, #a5f3fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat.number}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>{stat.label}</div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* ===== BENEFITS FOR ROLES ===== */}
      {/* ===== BENEFITS FOR ROLES - PREMIUM ===== */}
      <div style={{ 
        padding: '100px 40px', 
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decorations */}
        <div style={{ 
          position: 'absolute', 
          width: '400px', 
          height: '400px', 
          background: 'radial-gradient(circle, rgba(0, 153, 204, 0.08) 0%, transparent 70%)', 
          top: '-100px', 
          left: '-100px' 
        }} />
        <div style={{ 
          position: 'absolute', 
          width: '300px', 
          height: '300px', 
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)', 
          bottom: '-50px', 
          right: '-50px' 
        }} />

        <div style={{ textAlign: 'center', marginBottom: '60px', position: 'relative' }}>
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #0099cc 0%, #06b6d4 100%)',
            color: '#fff',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '16px'
          }}>LỢI ÍCH</span>
          <h2 style={{ 
            fontSize: '48px', 
            fontWeight: '800', 
            background: 'linear-gradient(135deg, #0077aa 0%, #0099cc 50%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            Giải Pháp Cho Mọi Vai Trò
          </h2>
          <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Tối ưu hóa quy trình làm việc cho từng đối tượng sử dụng
          </p>
        </div>

        <Row gutter={[32, 32]} style={{ position: 'relative' }}>
          {benefits.map((benefit, idx) => (
            <Col xs={24} md={8} key={idx}>
              <Card
                style={{
                  background: '#ffffff',
                  border: 'none',
                  borderRadius: '24px',
                  textAlign: 'center',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  height: '100%',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-16px)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 153, 204, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
                }}
              >
                {/* Top gradient line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${idx === 0 ? '#0099cc' : idx === 1 ? '#06b6d4' : '#22d3ee'} 0%, ${idx === 0 ? '#06b6d4' : idx === 1 ? '#22d3ee' : '#67e8f9'} 100%)`
                }} />
                
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: `linear-gradient(135deg, ${idx === 0 ? 'rgba(0, 153, 204, 0.1)' : idx === 1 ? 'rgba(6, 182, 212, 0.1)' : 'rgba(34, 211, 238, 0.1)'} 0%, transparent 100%)`,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '48px'
                }}>
                  {benefit.icon}
                </div>
                
                <h3 style={{ 
                  color: '#0077aa', 
                  fontSize: '22px', 
                  fontWeight: '700', 
                  marginBottom: '24px' 
                }}>
                  {benefit.title}
                </h3>
                <div style={{ textAlign: 'left' }}>
                  {benefit.items.map((item, i) => (
                    <div key={i} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: '14px',
                      padding: '8px 12px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '12px',
                        flexShrink: 0
                      }}>
                        <CheckOutlined style={{ color: '#fff', fontSize: '12px' }} />
                      </div>
                      <span style={{ color: '#334155', fontSize: '14px', fontWeight: '500' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* ===== 6 CORE FEATURES - PREMIUM ===== */}
      <div style={{ 
        padding: '100px 40px', 
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #0099cc 0%, #06b6d4 100%)',
            color: '#fff',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '16px'
          }}>TÍNH NĂNG</span>
          <h2 style={{ 
            fontSize: '48px', 
            fontWeight: '800', 
            background: 'linear-gradient(135deg, #0077aa 0%, #0099cc 50%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            Tính Năng Nổi Bật
          </h2>
          <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Công nghệ tiên tiến, bảo mật tối đa, trải nghiệm mượt mà
          </p>
        </div>
        <Row gutter={[24, 24]}>
          {features.map((feature, idx) => (
            <Col xs={24} md={12} lg={8} key={idx}>
              <Card 
                style={{
                  background: activeFeature === idx ? 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)' : '#ffffff',
                  border: activeFeature === idx ? '2px solid #0099cc' : '1px solid #e2e8f0',
                  borderRadius: '20px',
                  height: '100%',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: activeFeature === idx ? '0 20px 40px rgba(0, 153, 204, 0.15)' : '0 4px 15px rgba(0, 0, 0, 0.05)',
                  transform: activeFeature === idx ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 153, 204, 0.2)';
                  e.currentTarget.style.border = '2px solid #0099cc';
                }}
                onMouseLeave={(e) => {
                  if (activeFeature !== idx) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.border = '1px solid #e2e8f0';
                  }
                }}
              >
                {/* Number badge */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0099cc 0%, #06b6d4 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700'
                }}>
                  {idx + 1}
                </div>

                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ 
                    width: '70px', 
                    height: '70px', 
                    background: 'linear-gradient(135deg, rgba(0, 153, 204, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: '700', 
                    color: '#0077aa', 
                    marginBottom: '8px' 
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: '1.6' }}>
                    {feature.description}
                  </p>
                </div>
                <div>
                  {feature.details.map((detail, i) => (
                    <div key={i} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: '10px',
                      padding: '6px 10px',
                      background: '#f8fafc',
                      borderRadius: '6px'
                    }}>
                      <CheckCircleOutlined style={{ color: '#10b981', marginRight: '10px', fontSize: '14px' }} />
                      <span style={{ fontSize: '13px', color: '#475569' }}>{detail}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* ===== TECH STACK SECTION ===== */}
      <div style={{ 
        padding: '80px 40px', 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        
        <div style={{ textAlign: 'center', marginBottom: '50px', position: 'relative' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(0, 153, 204, 0.2)',
            color: '#22d3ee',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '16px',
            border: '1px solid rgba(34, 211, 238, 0.3)'
          }}>CÔNG NGHỆ</span>
          <h2 style={{ 
            fontSize: '40px', 
            fontWeight: '800', 
            color: '#ffffff',
            marginBottom: '16px'
          }}>
            Nền Tảng Công Nghệ Hiện Đại
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto' }}>
            Được xây dựng với các công nghệ hàng đầu thế giới
          </p>
        </div>
        
        <Row gutter={[20, 20]} justify="center" style={{ position: 'relative' }}>
          {techStack.map((tech, idx) => (
            <Col xs={12} sm={8} md={4} key={idx}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px 16px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{tech.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>{tech.name}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{tech.desc}</div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Certifications */}
        <div style={{ marginTop: '60px', textAlign: 'center', position: 'relative' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '20px' }}>CHỨNG CHỈ BẢO MẬT</p>
          <Row gutter={[16, 16]} justify="center">
            {certifications.map((cert, idx) => (
              <Col key={idx}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <span style={{ fontSize: '20px' }}>{cert.icon}</span>
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>{cert.name}</span>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* ===== PRICING SECTION - PREMIUM ===== */}
      <div style={{ 
        padding: '100px 40px', 
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #0099cc 0%, #06b6d4 100%)',
            color: '#fff',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '16px'
          }}>BẢNG GIÁ</span>
          <h2 style={{ 
            fontSize: '48px', 
            fontWeight: '800', 
            background: 'linear-gradient(135deg, #0077aa 0%, #0099cc 50%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            Chọn Gói Phù Hợp
          </h2>
          <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Minh bạch, linh hoạt, không phí ẩn
          </p>
        </div>
        <Row gutter={[24, 24]} justify="center">
          {pricingPlans.map((plan, index) => (
            <Col xs={24} md={8} key={index}>
              <Card
                style={{
                  border: plan.popular ? '2px solid #0099cc' : '1px solid #e0f2fe',
                  borderRadius: '24px',
                  background: plan.popular ? 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)' : '#ffffff',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  height: '100%',
                  position: 'relative',
                  boxShadow: plan.popular ? '0 25px 50px rgba(0, 153, 204, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.05)',
                  transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (!plan.popular) {
                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 153, 204, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!plan.popular) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
                  }
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #0099cc 0%, #06b6d4 50%, #22d3ee 100%)'
                  }} />
                )}
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'linear-gradient(135deg, #0099cc 0%, #06b6d4 100%)',
                    color: '#ffffff',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>
                    ⭐ PHỔ BIẾN
                  </div>
                )}
                <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#0077aa', marginBottom: '8px' }}>
                  {plan.name}
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                  {plan.description}
                </p>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ 
                    fontSize: '42px', 
                    fontWeight: '800', 
                    background: 'linear-gradient(135deg, #0077aa 0%, #0099cc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {plan.price}
                    <span style={{ fontSize: '16px', color: '#64748b', WebkitTextFillColor: '#64748b' }}>{plan.period}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '8px' }}>
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
                      <span style={{ color: '#1e293b' }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* ===== TESTIMONIALS SECTION - PREMIUM ===== */}
      <div style={{ 
        padding: '100px 40px', 
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            color: '#fff',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '16px'
          }}>ĐÁNH GIÁ</span>
          <h2 style={{ 
            fontSize: '48px', 
            fontWeight: '800', 
            background: 'linear-gradient(135deg, #0077aa 0%, #0099cc 50%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            Khách Hàng Nói Gì?
          </h2>
          <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Hơn 15,000 người dùng tin tưởng sử dụng mỗi ngày
          </p>
        </div>
        <Row gutter={[24, 24]}>
          {testimonials.map((testimonial, index) => (
            <Col xs={24} md={8} key={index}>
              <Card
                style={{
                  border: 'none',
                  borderRadius: '24px',
                  background: '#ffffff',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  height: '100%',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 153, 204, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
                }}
              >
                {/* Quote icon */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  fontSize: '48px',
                  color: 'rgba(0, 153, 204, 0.1)',
                  fontFamily: 'serif'
                }}>"</div>

                <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarOutlined key={i} style={{ color: '#fbbf24', fontSize: '16px' }} />
                  ))}
                </div>
                <p style={{ 
                  fontSize: '15px', 
                  color: '#334155', 
                  marginBottom: '24px', 
                  lineHeight: '1.7',
                  position: 'relative',
                  zIndex: 1
                }}>
                  "{testimonial.content}"
                </p>
                <div style={{ 
                  borderTop: '1px solid #f1f5f9', 
                  paddingTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    style={{ 
                      width: '56px', 
                      height: '56px', 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                      border: '3px solid #e0f2fe'
                    }}
                  />
                  <div>
                    <p style={{ 
                      fontSize: '15px', 
                      fontWeight: '700', 
                      color: '#0077aa',
                      margin: '0 0 2px 0'
                    }}>
                      {testimonial.name}
                    </p>
                    <p style={{ 
                      fontSize: '13px', 
                      color: '#64748b',
                      margin: '0'
                    }}>
                      {testimonial.role}
                    </p>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                      {testimonial.hospital}
                    </p>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* ===== TEAM SECTION - PREMIUM ===== */}
      <div style={{ 
        padding: '100px 40px', 
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #0099cc 0%, #06b6d4 100%)',
            color: '#fff',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '16px'
          }}>ĐỘI NGŨ</span>
          <h2 style={{ 
            fontSize: '48px', 
            fontWeight: '800', 
            background: 'linear-gradient(135deg, #0077aa 0%, #0099cc 50%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            Những Con Người Tuyệt Vời
          </h2>
          <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Chuyên gia hàng đầu trong lĩnh vực công nghệ y tế
        </p>
        </div>
        <Row gutter={[32, 32]} justify="center">
          {teamMembers.map((member, idx) => (
            <Col xs={24} sm={12} md={6} key={idx}>
              <Card 
                style={{
                  borderRadius: '24px',
                  textAlign: 'center',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  background: '#ffffff',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 153, 204, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
                  <img 
                    src={member.image} 
                    alt={member.name}
                    style={{ 
                      width: '130px', 
                      height: '130px', 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                      border: '4px solid #e0f2fe'
                    }}
                  />
                  {/* Online indicator */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#10b981',
                    border: '3px solid #fff'
                  }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0077aa', marginBottom: '4px' }}>
                  {member.name}
                </h3>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#fff',
                  fontWeight: '600', 
                  marginBottom: '12px',
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #0099cc 0%, #06b6d4 100%)',
                  padding: '4px 12px',
                  borderRadius: '12px'
                }}>
                  {member.role}
                </p>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                  {member.expertise}
                </p>
                <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', lineHeight: '1.5' }}>
                  {member.bio}
                </p>
                {/* Social icons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
                  <LinkedinOutlined style={{ fontSize: '18px', color: '#94a3b8', cursor: 'pointer' }} />
                  <TwitterOutlined style={{ fontSize: '18px', color: '#94a3b8', cursor: 'pointer' }} />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* ===== BLOG SECTION - PREMIUM ===== */}
      <div style={{ 
        padding: '100px 40px', 
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #0099cc 0%, #06b6d4 100%)',
            color: '#fff',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '16px'
          }}>TIN TỨC</span>
          <h2 style={{ 
            fontSize: '48px', 
            fontWeight: '800', 
            background: 'linear-gradient(135deg, #0077aa 0%, #0099cc 50%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            Bài Viết Mới Nhất
          </h2>
          <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Cập nhật những xu hướng mới nhất trong công nghệ y tế
          </p>
        </div>
        <Row gutter={[32, 32]}>
          {blogPosts.map((post, idx) => (
            <Col xs={24} md={8} key={idx}>
              <Card 
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 153, 204, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                }}
                cover={
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img 
                      src={post.image} 
                      alt={post.title}
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: '#0099cc',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {post.category}
                    </div>
                  </div>
                }
              >
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>{post.date}</p>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '12px', lineHeight: '1.4' }}>
                  {post.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                  {post.excerpt}
                </p>
                <Button type="link" style={{ padding: 0, color: '#0099cc', fontWeight: '600' }}>
                  Đọc thêm →
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* ===== ENHANCED STATISTICS SECTION ===== */}
      <div style={{ padding: '80px 40px', background: 'linear-gradient(135deg, #0099cc 0%, #0077aa 50%, #005a8b 100%)' }}>
        <h2 style={{ 
          fontSize: '44px', 
          fontWeight: '800', 
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          📈 Thành Tựu & Số Liệu
        </h2>
        <Row gutter={[24, 24]}>
          {achievements.map((achievement, idx) => (
            <Col xs={24} sm={12} md={4} key={idx}>
              <Card style={{
                border: '2px solid #a5f3fc',
                borderRadius: '16px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                color: '#ffffff'
              }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{achievement.icon}</div>
                <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', color: '#e0f2fe' }}>
                  {achievement.number}
                </div>
                <div style={{ fontSize: '14px', color: '#a5f3fc' }}>
                  {achievement.label}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* ===== CONTACT SECTION ===== */}
      <div style={{ 
        padding: '80px 40px', 
        background: 'linear-gradient(135deg, #0099cc 0%, #0077aa 100%)',
        color: '#ffffff'
      }}>
        <h2 style={{ 
          fontSize: '44px', 
          fontWeight: '800', 
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          📞 Liên Hệ Chúng Tôi
        </h2>
        <Row gutter={[40, 40]}>
          <Col xs={24} md={12}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#e0f2fe' }}>
              Thông Tin Liên Hệ
            </h3>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <PhoneOutlined style={{ fontSize: '20px', marginRight: '12px' }} />
                <span>+84 28 6281 1234</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <MailOutlined style={{ fontSize: '20px', marginRight: '12px' }} />
                <span>sales@healthcare.vn</span>
              </div>
            </div>
            <p style={{ color: '#a5f3fc', marginBottom: '20px' }}>
              Hỗ trợ 24/7 • Phản hồi trong vòng 1 giờ • Tư vấn miễn phí
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <LinkedinOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
              <FacebookOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
              <TwitterOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <Form
              form={contactForm}
              layout="vertical"
              onFinish={handleContactSubmit}
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Vui lòng nhập email' }]}
              >
                <Input placeholder="Email của bạn" size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>
              <Form.Item
                name="phone"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              >
                <Input placeholder="Số điện thoại" size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>
              <Form.Item
                name="message"
                rules={[{ required: true, message: 'Vui lòng nhập tin nhắn' }]}
              >
                <Input.TextArea placeholder="Tin nhắn của bạn" rows={3} style={{ borderRadius: '8px' }} />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                  color: '#0077aa',
                  border: 'none',
                  fontWeight: '700',
                  borderRadius: '12px',
                  height: '48px'
                }}
              >
                <RocketOutlined style={{ marginRight: '8px' }} /> Gửi Liên Hệ
              </Button>
            </Form>
          </Col>
        </Row>
      </div>

      {/* ===== FOOTER - PREMIUM ===== */}
      <div style={{
        padding: '60px 40px 30px',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        color: '#94a3b8'
      }}>
        <Row gutter={[40, 40]} style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Col xs={24} md={8}>
            <Logo size="medium" showText={true} />
            <p style={{ marginTop: '16px', fontSize: '14px', lineHeight: '1.8', color: '#94a3b8' }}>
              Nền tảng quản lý y tế số hàng đầu Việt Nam, giúp tối ưu quy trình và nâng cao chất lượng chăm sóc bệnh nhân.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: 'rgba(255,255,255,0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                <FacebookOutlined style={{ color: '#fff', fontSize: '18px' }} />
              </div>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: 'rgba(255,255,255,0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <LinkedinOutlined style={{ color: '#fff', fontSize: '18px' }} />
              </div>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: 'rgba(255,255,255,0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <TwitterOutlined style={{ color: '#fff', fontSize: '18px' }} />
              </div>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Sản Phẩm</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" style={{ color: '#94a3b8', fontSize: '14px', transition: 'color 0.3s' }}>Tính năng</a>
              <a href="#" style={{ color: '#94a3b8', fontSize: '14px' }}>Bảng giá</a>
              <a href="#" style={{ color: '#94a3b8', fontSize: '14px' }}>Tích hợp</a>
              <a href="#" style={{ color: '#94a3b8', fontSize: '14px' }}>API Docs</a>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Công Ty</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" style={{ color: '#94a3b8', fontSize: '14px' }}>Về chúng tôi</a>
              <a href="#" style={{ color: '#94a3b8', fontSize: '14px' }}>Blog</a>
              <a href="#" style={{ color: '#94a3b8', fontSize: '14px' }}>Tuyển dụng</a>
              <a href="#" style={{ color: '#94a3b8', fontSize: '14px' }}>Liên hệ</a>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Đăng Ký Nhận Tin</h4>
            <p style={{ fontSize: '14px', marginBottom: '16px', color: '#94a3b8' }}>
              Nhận thông tin mới nhất về công nghệ y tế
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Input 
                placeholder="Email của bạn" 
                style={{ 
                  borderRadius: '8px', 
                  background: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff'
                }} 
              />
              <Button 
                type="primary" 
                style={{ 
                  background: 'linear-gradient(135deg, #0099cc 0%, #06b6d4 100%)', 
                  border: 'none',
                  borderRadius: '8px'
                }}
              >
                Đăng ký
              </Button>
            </div>
          </Col>
        </Row>
        
        {/* Bottom footer */}
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          marginTop: '40px', 
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          maxWidth: '1200px',
          margin: '40px auto 0'
        }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            © 2025 Healthcare System. All rights reserved.
          </p>
          <Space size={24} style={{ fontSize: '13px' }}>
            <a href="#" style={{ color: '#64748b' }}>Điều khoản</a>
            <a href="#" style={{ color: '#64748b' }}>Bảo mật</a>
            <a href="#" style={{ color: '#64748b' }}>Cookie</a>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
