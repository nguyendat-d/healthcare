import React from 'react';
import { Button, Row, Col, Card, Input, Space, Collapse } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const BlogPage = () => {
  const navigate = useNavigate();

  const blogPosts = [
    {
      date: '24/11/2025',
      category: 'Tips',
      title: 'Cách tối ưu hóa quy trình quản lý bệnh nhân',
      excerpt: 'Khám phá những cách tốt nhất để tăng hiệu suất công việc và giảm thời gian quản lý...',
      image: '📊',
      content: 'Quản lý bệnh nhân hiệu quả là chìa khóa để cải thiện dịch vụ y tế. Bài viết này sẽ giới thiệu...'
    },
    {
      date: '20/11/2025',
      category: 'Security',
      title: 'Bảo mật dữ liệu y tế - những điều cần biết',
      excerpt: 'Hiểu rõ hơn về cách chúng tôi bảo vệ dữ liệu của bạn và các tiêu chuẩn bảo mật...',
      image: '🔒',
      content: 'Bảo mật dữ liệu bệnh nhân là ưu tiên hàng đầu. Chúng tôi sử dụng những công nghệ...'
    },
    {
      date: '15/11/2025',
      category: 'Case Study',
      title: 'Bệnh viện X tăng hiệu suất 40% với Healthcare System',
      excerpt: 'Tìm hiểu câu chuyện thành công của một bệnh viện lớn trong việc áp dụng hệ thống...',
      image: '🏥',
      content: 'Bệnh viện X đã trải qua quá trình chuyển đổi số thành công...'
    },
    {
      date: '10/11/2025',
      category: 'News',
      title: 'Phát hành phiên bản 2.0 với các tính năng mới',
      excerpt: 'Công bố những tính năng mới và cải tiến trong phiên bản 2.0 của Healthcare System...',
      image: '🎉',
      content: 'Chúng tôi rất vui mừng công bố phiên bản 2.0...'
    },
    {
      date: '05/11/2025',
      category: 'Tutorial',
      title: 'Hướng dẫn cài đặt và cấu hình ban đầu',
      excerpt: 'Video hướng dẫn chi tiết cách cài đặt và cấu hình Healthcare System...',
      image: '📹',
      content: 'Bắt đầu với Healthcare System rất đơn giản...'
    },
    {
      date: '01/11/2025',
      category: 'Update',
      title: 'Cập nhật bảo mật quan trọng - vui lòng cập nhật ngay',
      excerpt: 'Thông báo về bản vá bảo mật quan trọng được phát hành để bảo vệ hệ thống...',
      image: '⚠️',
      content: 'Bản cập nhật bảo mật này khắc phục...'
    }
  ];

  const faqItems = [
    {
      key: '1',
      label: '❓ Làm thế nào để theo dõi blog?',
      children: 'Bạn có thể subscribe vào email list của chúng tôi để nhận các bài viết mới nhất hàng tuần.'
    },
    {
      key: '2',
      label: '✍️ Tôi có thể viết bài viết guest post không?',
      children: 'Có chứ! Chúng tôi rất hoan nghênh những bài viết từ cộng đồng. Vui lòng liên hệ với chúng tôi.'
    },
    {
      key: '3',
      label: '🏥 Có tài liệu hướng dẫn nào không?',
      children: 'Có, chúng tôi có một thư viện tài liệu hướng dẫn chi tiết về tất cả các tính năng.'
    },
    {
      key: '4',
      label: '📺 Có video tutorial không?',
      children: 'Có, chúng tôi cung cấp video hướng dẫn cho tất cả các tính năng chính trên YouTube.'
    }
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
          Blog & Tin Tức
        </h1>
        <p style={{ fontSize: '18px', color: '#a5f3fc', maxWidth: '700px', margin: '0 auto' }}>
          Cập nhật kiến thức, mẹo hữu ích và những câu chuyện thành công
        </p>
      </div>

      {/* Blog Posts */}
      <div style={{ padding: '80px 40px', background: '#f8fdfb' }}>
        <Row gutter={[24, 24]}>
          {blogPosts.map((post, idx) => (
            <Col xs={24} md={12} lg={8} key={idx}>
              <Card style={{
                border: '1px solid #e0f2fe',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
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
                <div style={{
                  background: 'linear-gradient(135deg, #0099cc 0%, #0077aa 100%)',
                  padding: '40px',
                  textAlign: 'center',
                  fontSize: '48px',
                  marginBottom: '16px'
                }}>
                  {post.image}
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#0099cc', fontWeight: '600', background: '#e0f2fe', padding: '4px 10px', borderRadius: '12px' }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      {post.date}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0099cc', marginBottom: '12px', lineHeight: '1.4' }}>
                    {post.title}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', lineHeight: '1.5' }}>
                    {post.excerpt}
                  </p>
                  <Button type="text" style={{ color: '#0099cc', fontWeight: '600', padding: 0 }}>
                    Đọc thêm →
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Newsletter */}
      <div style={{ padding: '60px 40px', background: '#ffffff' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#0099cc', textAlign: 'center', marginBottom: '30px' }}>
          📧 Đăng Ký Nhận Bản Tin
        </h2>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Space.Compact style={{ width: '100%' }}>
            <Input 
              size="large" 
              placeholder="Email của bạn" 
              style={{ borderRadius: '8px 0 0 8px' }}
            />
            <Button 
              type="primary" 
              size="large"
              style={{ 
                background: 'linear-gradient(135deg, #0099cc 0%, #0077aa 100%)',
                border: 'none',
                borderRadius: '0 8px 8px 0'
              }}
            >
              Đăng Ký
            </Button>
          </Space.Compact>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: '80px 40px', background: '#f8fdfb' }}>
        <h2 style={{ fontSize: '44px', fontWeight: '800', color: '#0099cc', textAlign: 'center', marginBottom: '60px' }}>
          ❓ Câu Hỏi Thường Gặp
        </h2>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Collapse
            items={faqItems}
            style={{ border: '1px solid #e0f2fe', borderRadius: '8px' }}
          />
        </div>
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

export default BlogPage;
