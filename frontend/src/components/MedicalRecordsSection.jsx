import React, { useState } from 'react';
import { Card, Table, Tag, Button, Drawer, Empty, Descriptions, Space, Row, Col, Statistic } from 'antd';
import { EyeOutlined, FileTextOutlined, CalendarOutlined, MedicineBoxOutlined } from '@ant-design/icons';

const MedicalRecordsSection = ({ records = [], patient }) => {
  const [drawer, setDrawer] = useState(false);
  const [selected, setSelected] = useState(null);

  const diagnosisCount = records.length;
  const treatmentTypes = [...new Set(records.map(r => r.type))].length;

  const columns = [
    { title: 'Ngày', dataIndex: 'date', key: 'date', width: 120 },
    { title: 'Loại', dataIndex: 'type', key: 'type', width: 100 },
    { title: 'Chẩn đoán', dataIndex: 'diagnosis', key: 'diagnosis', ellipsis: true },
    {
      title: 'Hành động',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => { setSelected(record); setDrawer(true); }} />
      )
    }
  ];

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic title="Tổng bệnh án" value={diagnosisCount} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic title="Loại bệnh lý" value={treatmentTypes} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ borderRadius: '12px' }}>
            <Statistic title="Nhóm máu" value={patient?.bloodType || 'N/A'} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: '12px' }}>
        <Table 
          dataSource={records}
          columns={columns} 
          rowKey="_id"
          pagination={false}
          locale={{ emptyText: <Empty description="Không có hồ sơ y tế" /> }}
        />
      </Card>

      <Drawer title={<><FileTextOutlined /> Chi tiết hồ sơ y tế</>} onClose={() => setDrawer(false)} open={drawer} width={500}>
        {selected && (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label={<><CalendarOutlined /> Ngày</>}>{selected.date}</Descriptions.Item>
            <Descriptions.Item label="Loại">{selected.type}</Descriptions.Item>
            <Descriptions.Item label="Chẩn đoán">{selected.diagnosis}</Descriptions.Item>
            <Descriptions.Item label={<><MedicineBoxOutlined /> Điều trị</>}>{selected.treatment}</Descriptions.Item>
            <Descriptions.Item label="Bác sĩ">{selected.doctor?.name || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú">{selected.notes || 'Không có ghi chú'}</Descriptions.Item>
            <Descriptions.Item label="Tệp đính kèm">{selected.attachments?.length > 0 ? `${selected.attachments.length} tệp` : 'Không có'}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </>
  );
};

export default MedicalRecordsSection;
