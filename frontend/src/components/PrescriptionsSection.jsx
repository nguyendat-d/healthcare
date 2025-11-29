import React from 'react';
import { Card, Table, Tag, Button, Empty, Space, Row, Col, Statistic, Descriptions } from 'antd';
import { DeleteOutlined, CheckOutlined, CalendarOutlined } from '@ant-design/icons';

const PrescriptionsSection = ({ prescriptions = [], appointments = [], records = [] }) => {
  const activePrescriptions = prescriptions.filter(p => p.status === 'active').length;
  const expiredPrescriptions = prescriptions.filter(p => p.status === 'expired').length;

  // Get related appointment for a prescription
  const getRelatedAppointment = (prescriptionId) => {
    return appointments.find(apt => apt._id === prescriptionId || apt.prescriptionIds?.includes(prescriptionId));
  };

  const columns = [
    { title: 'Thuốc', dataIndex: ['medication', 'name'], key: 'medication', width: 150 },
    { title: 'Liều lượng', dataIndex: 'dosage', key: 'dosage', width: 100 },
    { title: 'Tần suất', dataIndex: 'frequency', key: 'frequency', width: 100 },
    { title: 'Ngày bắt đầu', dataIndex: 'startDate', key: 'startDate', width: 120 },
    { title: 'Ngày kết thúc', dataIndex: 'endDate', key: 'endDate', width: 120 },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => <Tag color={status === 'active' ? 'green' : 'default'}>{status === 'active' ? 'Đang dùng' : 'Hết hạn'}</Tag>
    }
  ];

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic title="Tổng đơn thuốc" value={prescriptions.length} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic title="Đang dùng" value={activePrescriptions} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic title="Hết hạn" value={expiredPrescriptions} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: '12px' }}>
        <Table 
          dataSource={prescriptions}
          columns={columns}
          rowKey="_id"
          pagination={false}
          expandable={{
            expandedRowRender: (record) => {
              const apt = getRelatedAppointment(record._id);
              return apt ? (
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label={<><CalendarOutlined /> Lịch khám</>}>{apt.appointmentDate}</Descriptions.Item>
                  <Descriptions.Item label="Bác sĩ">{apt.doctor?.name}</Descriptions.Item>
                  <Descriptions.Item label="Khoa">{apt.department}</Descriptions.Item>
                  <Descriptions.Item label="Chẩn đoán">{record.diagnosis || 'N/A'}</Descriptions.Item>
                </Descriptions>
              ) : <span style={{ color: '#ccc' }}>Không có thông tin lịch khám liên quan</span>;
            }
          }}
          locale={{ emptyText: <Empty description="Không có đơn thuốc" /> }}
        />
      </Card>
    </>
  );
};

export default PrescriptionsSection;
