import React, { useState } from 'react';
import { Card, Row, Col, Table, Tag, Button, Drawer, Empty, Descriptions, Space, Statistic, Modal } from 'antd';
import { EyeOutlined, PrinterOutlined, DownloadOutlined, DollarOutlined, FileTextOutlined } from '@ant-design/icons';

const BillingSection = ({ bills = [], patient, appointments = [] }) => {
  const [drawer, setDrawer] = useState(false);
  const [selected, setSelected] = useState(null);

  const statusColor = {
    paid: 'green',
    pending: 'orange',
    overdue: 'red',
    cancelled: 'default'
  };

  const getRelatedAppointment = (billId) => {
    const bill = bills.find(b => b._id === billId);
    if (!bill) return null;
    return appointments.find(apt => apt._id === bill.appointmentId || apt.billId === bill._id);
  };

  const columns = [
    { 
      title: 'Ma hoa don', 
      dataIndex: 'billId', 
      key: 'billId',
      width: 120,
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    { 
      title: 'Ngay phat hanh', 
      dataIndex: 'issueDate', 
      key: 'issueDate',
      width: 110,
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    { 
      title: 'Loai hoa don', 
      dataIndex: 'billType', 
      key: 'billType',
      width: 100,
      render: (type) => type === 'CONSULTATION' ? 'Kham benh' : 'Khac'
    },
    { 
      title: 'Tong tien', 
      dataIndex: 'grandTotal', 
      key: 'grandTotal',
      width: 130,
      render: (amount) => <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{amount?.toLocaleString('vi-VN')} VND</span>
    },
    { 
      title: 'Trang thai', 
      dataIndex: 'status', 
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={statusColor[status]}>
          {status === 'paid' ? 'Da thanh toan' : status === 'pending' ? 'Cho thanh toan' : status === 'overdue' ? 'Qua han' : 'Huy'}
        </Tag>
      )
    },
    {
      title: 'Hanh dong',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="text" size="small" icon={<EyeOutlined />} title="Xem" onClick={() => { setSelected(record); setDrawer(true); }} />
          <Button type="text" size="small" icon={<PrinterOutlined />} title="In" onClick={() => window.print()} />
        </Space>
      )
    }
  ];

  const totalRevenue = bills.reduce((sum, bill) => sum + (bill.grandTotal || 0), 0);
  const paidAmount = bills.filter(b => b.status === 'paid').reduce((sum, bill) => sum + (bill.grandTotal || 0), 0);
  const pendingAmount = bills.filter(b => b.status === 'pending').reduce((sum, bill) => sum + (bill.grandTotal || 0), 0);

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic 
              title="Tong hoa don" 
              value={bills.length} 
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic 
              title="Tong doanh thu" 
              value={totalRevenue} 
              suffix="VND"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: '18px' }}
              precision={0}
              formatter={(val) => val?.toLocaleString('vi-VN')}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic 
              title="Da thanh toan" 
              value={paidAmount} 
              suffix="VND"
              valueStyle={{ color: '#52c41a', fontSize: '18px' }}
              precision={0}
              formatter={(val) => val?.toLocaleString('vi-VN')}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic 
              title="Cho thanh toan" 
              value={pendingAmount} 
              suffix="VND"
              valueStyle={{ color: '#faad14', fontSize: '18px' }}
              precision={0}
              formatter={(val) => val?.toLocaleString('vi-VN')}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: '12px' }}>
        <Table 
          dataSource={bills}
          columns={columns} 
          rowKey="_id" 
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: <Empty description="Khong co hoa don nao" /> }}
        />
      </Card>

      <Drawer
        title={selected ? `Chi tiet hoa don ${selected.billId}` : 'Chi tiet hoa don'}
        placement="right"
        onClose={() => setDrawer(false)}
        open={drawer}
        width={600}
      >
        {selected && (
          <>
            <Descriptions bordered column={1} size="small" style={{ marginBottom: '20px' }}>
              <Descriptions.Item label="Ma hoa don">{selected.billId}</Descriptions.Item>
              <Descriptions.Item label="Loai hoa don">
                {selected.billType === 'CONSULTATION' ? 'Kham benh' : 'Khac'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngay phat hanh">
                {new Date(selected.issueDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Ngay den han">
                {new Date(selected.dueDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Trang thai">
                <Tag color={statusColor[selected.status]}>
                  {selected.status === 'paid' ? 'Da thanh toan' : selected.status === 'pending' ? 'Cho thanh toan' : selected.status === 'overdue' ? 'Qua han' : 'Huy'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {selected.services && selected.services.length > 0 && (
              <Card title="Chi tiet dich vu" size="small" style={{ marginBottom: '20px' }}>
                <Table 
                  dataSource={selected.services}
                  columns={[
                    { title: 'Dich vu', dataIndex: 'serviceName', key: 'serviceName' },
                    { title: 'So luong', dataIndex: 'quantity', key: 'quantity' },
                    { title: 'Don gia', dataIndex: 'unitPrice', key: 'unitPrice', render: (val) => `${val?.toLocaleString('vi-VN')} VND` },
                    { title: 'Thanh tien', dataIndex: 'total', key: 'total', render: (val) => `${val?.toLocaleString('vi-VN')} VND` }
                  ]}
                  rowKey="serviceCode"
                  pagination={false}
                  size="small"
                />
              </Card>
            )}

            <Card title="Tong hop" size="small" style={{ marginBottom: '20px', backgroundColor: '#f5f5f5' }}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="Tong tien hang">{selected.subtotal?.toLocaleString('vi-VN')} VND</Descriptions.Item>
                <Descriptions.Item label="Thue VAT">{selected.totalTax?.toLocaleString('vi-VN')} VND</Descriptions.Item>
                <Descriptions.Item label="Tong cong">{selected.grandTotal?.toLocaleString('vi-VN')} VND</Descriptions.Item>
                <Descriptions.Item label="Da thanh toan">{selected.amountPaid?.toLocaleString('vi-VN')} VND</Descriptions.Item>
                <Descriptions.Item label="Con lai">
                  <span style={{ color: selected.balanceDue > 0 ? '#ff4d4f' : '#52c41a' }}>
                    {selected.balanceDue?.toLocaleString('vi-VN')} VND
                  </span>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {getRelatedAppointment(selected._id) && (
              <Card title="Thong tin lich kham lien quan" size="small">
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="Ngay kham">
                    {getRelatedAppointment(selected._id)?.appointmentDate}
                  </Descriptions.Item>
                  <Descriptions.Item label="Bac si">
                    {getRelatedAppointment(selected._id)?.doctor?.name || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Khoa">
                    {getRelatedAppointment(selected._id)?.department || 'N/A'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          </>
        )}
      </Drawer>
    </>
  );
};

export default BillingSection;
