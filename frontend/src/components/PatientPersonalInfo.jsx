import React from 'react';
import { Card, Row, Col, Statistic, Descriptions, Avatar, Badge, Button, Space } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, DownloadOutlined } from '@ant-design/icons';

const PatientPersonalInfo = ({ patientData }) => {
  return (
    <div className="animate-fadeInUp">
      {patientData && (
        <Row gutter={[20, 20]}>
          <Col xs={24} lg={8}>
            <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
              <Avatar size={120} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', marginBottom: '16px' }} />
              <h2 style={{ margin: '16px 0 4px', fontSize: '20px', fontWeight: '700' }}>
                {patientData?.fullName}
              </h2>
              <p style={{ color: '#666', margin: '0 0 20px', fontSize: '14px' }}>Bệnh nhân</p>
              <Space>
                <Button type="primary" size="small" icon={<DownloadOutlined />}>Xuất hồ sơ</Button>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card style={{ borderRadius: '12px' }}>
              <Descriptions title="Thông tin cá nhân" bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} size="small">
                <Descriptions.Item label="Mã bệnh nhân">{patientData?._id}</Descriptions.Item>
                <Descriptions.Item label="Tuổi">{patientData?.age} tuổi</Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                  <Badge color={patientData?.gender === 'male' ? '#1890ff' : '#eb2f96'} text={patientData?.gender === 'male' ? 'Nam' : 'Nữ'} />
                </Descriptions.Item>
                <Descriptions.Item label="Nhóm máu">{patientData?.bloodType || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label={<><PhoneOutlined /> SĐT</>}>{patientData?.phone}</Descriptions.Item>
                <Descriptions.Item label={<><MailOutlined /> Email</>}>{patientData?.email}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>{patientData?.address}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24}>
            <Card title="Thông tin y tế" style={{ borderRadius: '12px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Statistic title="Chiều cao" value={`${patientData?.medicalInfo?.height || 0} cm`} />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic title="Cân nặng" value={`${patientData?.medicalInfo?.weight || 0} kg`} />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic 
                    title="BMI" 
                    value={patientData?.medicalInfo?.bmi || 'N/A'}
                    valueStyle={{ color: patientData?.medicalInfo?.bmi < 18.5 ? '#faad14' : patientData?.medicalInfo?.bmi < 25 ? '#52c41a' : '#f5222d' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default PatientPersonalInfo;
