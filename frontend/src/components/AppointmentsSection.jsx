import React, { useState } from 'react';
import { Card, Row, Col, Table, Tag, Button, Drawer, Empty, Descriptions, Space, Statistic } from 'antd';
import { EyeOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, MedicineBoxOutlined } from '@ant-design/icons';

const AppointmentsSection = ({ appointments = [], patient, prescriptions = [], bills = [] }) => {
  const [drawer, setDrawer] = useState(false);
  const [selected, setSelected] = useState(null);

  const statusColor = {
    scheduled: 'blue',
    completed: 'green',
    cancelled: 'red',
    rescheduled: 'orange'
  };

  const statusIcon = {
    scheduled: <ClockCircleOutlined />,
    completed: <CheckCircleOutlined />,
    cancelled: <CloseCircleOutlined />
  };

  const getRelatedData = (appointmentId) => {
    const relatedPrescriptions = prescriptions.filter(rx => rx.appointmentId === appointmentId);
    const relatedBills = bills.filter(bill => bill.appointmentId === appointmentId);
    return { relatedPrescriptions, relatedBills };
  };

  const columns = [
    { title: 'Ngay kham', dataIndex: 'appointmentDate', key: 'appointmentDate', width: 120 },
    { title: 'Bac si', dataIndex: ['doctor', 'name'], key: 'doctor', width: 150 },
    { title: 'Khoa', dataIndex: 'department', key: 'department', width: 120 },
    {
      title: 'Trang thai',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag icon={statusIcon[status]} color={statusColor[status]}>
          {status === 'scheduled' ? 'Da dat' : status === 'completed' ? 'Hoan thanh' : status === 'cancelled' ? 'Huy' : 'Cho xac nhan'}
        </Tag>
      )
    },
    {
      title: 'Hanh dong',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => { setSelected(record); setDrawer(true); }} />
        </Space>
      )
    }
  ];

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic title="Tong lich kham" value={appointments.length} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic title="Da hoan thanh" value={appointments.filter(a => a.status === 'completed').length} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic title="Sap toi" value={appointments.filter(a => a.status === 'scheduled').length} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic title="Huy" value={appointments.filter(a => a.status === 'cancelled').length} valueStyle={{ color: '#f5222d' }} />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: '12px' }}>
        <Table 
          dataSource={appointments}
          columns={columns} 
          rowKey="_id" 
          pagination={false}
          locale={{ emptyText: <Empty description="Khong co lich kham" /> }}
        />
      </Card>

      <Drawer
        title="Chi tiet lich kham"
        placement="right"
        onClose={() => setDrawer(false)}
        open={drawer}
        width={500}
      >
        {selected && (
          <>
            <Descriptions bordered column={1} size="small" style={{ marginBottom: '20px' }}>
              <Descriptions.Item label="Ngay kham">{selected.appointmentDate}</Descriptions.Item>
              <Descriptions.Item label="Thoi gian">{selected.appointmentTime}</Descriptions.Item>
              <Descriptions.Item label="Bac si">{selected.doctor?.name}</Descriptions.Item>
              <Descriptions.Item label="Khoa">{selected.department}</Descriptions.Item>
              <Descriptions.Item label="Trieu chung">{selected.symptoms}</Descriptions.Item>
              <Descriptions.Item label="Trang thai">
                <Tag icon={statusIcon[selected.status]} color={statusColor[selected.status]}>
                  {selected.status === 'scheduled' ? 'Da dat' : selected.status === 'completed' ? 'Hoan thanh' : 'Huy'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {getRelatedData(selected._id).relatedPrescriptions.length > 0 && (
              <Card title={<><MedicineBoxOutlined /> Don thuoc lien quan</>} size="small" style={{ marginBottom: '20px' }}>
                <Table 
                  dataSource={getRelatedData(selected._id).relatedPrescriptions}
                  columns={[
                    { title: 'Thuoc', dataIndex: 'medicationName', key: 'medicationName' },
                    { title: 'Lieu luong', dataIndex: 'dosage', key: 'dosage' },
                    { title: 'Tan suat', dataIndex: 'frequency', key: 'frequency' }
                  ]}
                  rowKey="_id"
                  pagination={false}
                  size="small"
                />
              </Card>
            )}

            {getRelatedData(selected._id).relatedBills.length > 0 && (
              <Card title="Hoa don lien quan" size="small">
                <Table 
                  dataSource={getRelatedData(selected._id).relatedBills}
                  columns={[
                    { title: 'Ma HD', dataIndex: 'invoiceNo', key: 'invoiceNo' },
                    { title: 'Tong tien', dataIndex: 'totalAmount', key: 'totalAmount', render: (val) => `${val?.toLocaleString('vi-VN')} VND` },
                    { title: 'Trang thai', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'paid' ? 'green' : 'orange'}>{s === 'paid' ? 'Da TT' : 'Cho TT'}</Tag> }
                  ]}
                  rowKey="_id"
                  pagination={false}
                  size="small"
                />
              </Card>
            )}
          </>
        )}
      </Drawer>
    </>
  );
};

export default AppointmentsSection;
