import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Menu,
  Button,
  message,
  Spin,
  Drawer,
  Descriptions,
  Badge,
  Tag,
  Table,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Empty,
  Avatar
} from 'antd';
import {
  LogoutOutlined,
  HomeOutlined,
  FileTextOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CreditCardOutlined,
  HistoryOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../utils/api';
import dayjs from 'dayjs';
import '../styles/animations.css';

const { Header, Sider, Content } = Layout;

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const [loading, setLoading] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [bills, setBills] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPatientData();
  }, [selectedKey]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      
      // Fetch patient demographics
      const demoResponse = await apiClient.get(`/patients/${user._id}/demographics`);
      setPatientData(demoResponse.data.data);

      // Fetch medical records
      if (selectedKey === '2') {
        const recordsResponse = await apiClient.get(`/patients/${user._id}/medical-records`);
        setMedicalRecords(recordsResponse.data.data?.records || []);
      }

      // Fetch appointments
      if (selectedKey === '3') {
        const appointmentsResponse = await apiClient.get(`/patients/${user._id}/appointments`);
        setAppointments(appointmentsResponse.data.data?.appointments || []);
      }

      // Fetch prescriptions
      if (selectedKey === '4') {
        const prescriptionsResponse = await apiClient.get(`/patients/${user._id}/prescriptions`);
        setPrescriptions(prescriptionsResponse.data.data?.prescriptions || []);
      }

      // Fetch bills/invoices
      if (selectedKey === '5.5') {
        const billsResponse = await apiClient.get(`/bills?patientId=${user._id}`);
        setBills(billsResponse.data.data?.bills || []);
      }
    } catch (err) {
      console.error('Error fetching patient data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
      className: 'menu-item-animated'
    },
    {
      key: '2',
      icon: <FileTextOutlined />,
      label: 'Hồ sơ y tế',
      className: 'menu-item-animated'
    },
    {
      key: '3',
      icon: <CalendarOutlined />,
      label: 'Lịch hẹn',
      className: 'menu-item-animated'
    },
    {
      key: '4',
      icon: <MedicineBoxOutlined />,
      label: 'Đơn thuốc',
      className: 'menu-item-animated'
    },
    {
      key: '5',
      icon: <CreditCardOutlined />,
      label: 'Bảo hiểm',
      className: 'menu-item-animated'
    },
    {
      key: '5.5',
      icon: <HistoryOutlined />,
      label: 'Hóa đơn',
      className: 'menu-item-animated'
    },
    {
      key: '6',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
      className: 'menu-item-animated'
    }
  ];
  const medicalRecordsColumns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      width: 120
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      render: (type) => <Tag color="blue">{type}</Tag>,
      width: 100
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      ellipsis: true
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctorName',
      width: 120
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setSelectedRecord(record);
            setDrawerVisible(true);
          }}
        >
          Chi tiết
        </Button>
      ),
      width: 100
    }
  ];

  const appointmentsColumns = [
    {
      title: 'Ngày giờ',
      dataIndex: 'appointmentDate',
      render: (date) => new Date(date).toLocaleString('vi-VN'),
      width: 160
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctorName',
      width: 120
    },
    {
      title: 'Phòng',
      dataIndex: 'room',
      width: 80
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => {
        const statusMap = {
          SCHEDULED: { color: 'blue', text: 'Đã đặt' },
          COMPLETED: { color: 'success', text: 'Hoàn thành' },
          CANCELLED: { color: 'error', text: 'Hủy' }
        };
        const config = statusMap[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      width: 100
    }
  ];

  const prescriptionsColumns = [
    {
      title: 'Tên thuốc',
      dataIndex: 'medicineName',
      width: 130
    },
    {
      title: 'Liều lượng',
      dataIndex: 'dosage',
      width: 100
    },
    {
      title: 'Cách dùng',
      dataIndex: 'instruction',
      width: 120
    },
    {
      title: 'Ngày cấp',
      dataIndex: 'prescriptionDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      width: 120
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => {
        const statusMap = {
          ACTIVE: { color: 'success', text: 'Hoạt động' },
          EXPIRED: { color: 'error', text: 'Hết hiệu lực' },
          COMPLETED: { color: 'default', text: 'Hoàn thành' }
        };
        const config = statusMap[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      width: 120
    }
  ];

  const billsColumns = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'invoiceNumber',
      width: 130
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      width: 110
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      render: (amount) => `${amount?.toLocaleString('vi-VN')} ₫`,
      width: 130
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => {
        const statusMap = {
          PENDING: { color: 'orange', text: 'Chưa TT' },
          PAID: { color: 'green', text: 'Đã TT' },
          OVERDUE: { color: 'red', text: 'Quá hạn' },
          CANCELLED: { color: 'gray', text: 'Hủy' }
        };
        const config = statusMap[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      width: 100
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Button type="primary" size="small">
          Chi tiết
        </Button>
      ),
      width: 100
    }
  ];

  const StatCard = ({ icon, title, value, color }) => (
    <Card
      style={{
        borderTop: `4px solid ${color}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '28px' }}>{icon}</div>
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>{title}</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: color }}>{value}</div>
        </div>
      </div>
    </Card>
  );

  return (
    <Layout className="min-h-screen" style={{ background: '#f0f2f5' }}>
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflow: 'auto',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ padding: '24px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏥</div>
          {!collapsed && (
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>
              Healthcare Plus
            </div>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => setSelectedKey(e.key)}
          items={menuItems}
          style={{
            background: 'transparent',
            borderRight: 'none'
          }}
          itemLabelRender={(label) => (
            <span style={{ color: '#fff', fontSize: '14px' }}>{label}</span>
          )}
          selectedItemType="group"
        />
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: collapsed ? 80 : 240 }}>
        {/* Header */}
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 99
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              size="large"
            />
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Bệnh nhân: {user?.personalInfo?.firstName} {user?.personalInfo?.lastName}
            </h2>
          </div>
          <Space>
            <Avatar icon={<UserOutlined />} />
            <Button
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </Space>
        </Header>

        {/* Content */}
        <Content style={{ margin: '24px 24px', minHeight: 'calc(100vh - 100px)' }}>
          <Spin spinning={loading} delay={500}>
            {/* Home Dashboard */}
            {selectedKey === '1' && (
              <div className="animate-fadeInUp">
                <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '600' }}>
                  Chào mừng, {user?.personalInfo?.firstName}! 👋
                </h2>

                {/* Statistics Cards */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                  <Col xs={24} sm={12} lg={6}>
                    <StatCard
                      icon="📅"
                      title="Lịch hẹn sắp tới"
                      value={appointments.filter(a => a.status === 'SCHEDULED').length}
                      color="#1890ff"
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <StatCard
                      icon="💊"
                      title="Đơn thuốc hoạt động"
                      value={prescriptions.filter(p => p.status === 'ACTIVE').length}
                      color="#52c41a"
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <StatCard
                      icon="📄"
                      title="Hồ sơ y tế"
                      value={medicalRecords.length}
                      color="#faad14"
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <StatCard
                      icon={user?.status === 'ACTIVE' ? '✅' : '❌'}
                      title="Trạng thái"
                      value={user?.status === 'ACTIVE' ? 'Hoạt động' : 'Không'}
                      color={user?.status === 'ACTIVE' ? '#52c41a' : '#f5222d'}
                    />
                  </Col>
                </Row>

                {/* Patient Info Card */}
                {patientData && (
                  <Row gutter={16}>
                    <Col xs={24} lg={12}>
                      <Card
                        title="📋 Thông tin sơ lược"
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                      >
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="Email">
                            <MailOutlined style={{ marginRight: '8px' }} />
                            {user?.email}
                          </Descriptions.Item>
                          <Descriptions.Item label="Số điện thoại">
                            <PhoneOutlined style={{ marginRight: '8px' }} />
                            {patientData.phone}
                          </Descriptions.Item>
                          <Descriptions.Item label="Ngày sinh">
                            {new Date(patientData.dateOfBirth).toLocaleDateString('vi-VN')}
                          </Descriptions.Item>
                          <Descriptions.Item label="Giới tính">
                            {patientData.gender === 'MALE' ? '👨 Nam' : '👩 Nữ'}
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>
                    {patientData?.insurance && (
                      <Col xs={24} lg={12}>
                        <Card
                          title="🛡️ Bảo hiểm"
                          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                        >
                          <Descriptions column={1} size="small">
                            <Descriptions.Item label="Công ty">
                              {patientData.insurance.provider}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số bảo hiểm">
                              {patientData.insurance.policyNumber}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                              <Badge
                                status={patientData.insurance.status === 'ACTIVE' ? 'success' : 'error'}
                                text={patientData.insurance.status === 'ACTIVE' ? '✅ Hoạt động' : '❌ Hết hạn'}
                              />
                            </Descriptions.Item>
                          </Descriptions>
                        </Card>
                      </Col>
                    )}
                  </Row>
                )}
              </div>
            )}

            {/* Medical Records */}
            {selectedKey === '2' && (
              <Card
                title="📄 Hồ sơ y tế"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                <Table
                  columns={medicalRecordsColumns}
                  dataSource={medicalRecords}
                  pagination={{ pageSize: 10 }}
                  rowKey="_id"
                  scroll={{ x: 600 }}
                />
              </Card>
            )}

            {/* Appointments */}
            {selectedKey === '3' && (
              <Card
                title="📅 Lịch hẹn"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                <Table
                  columns={appointmentsColumns}
                  dataSource={appointments}
                  pagination={{ pageSize: 10 }}
                  rowKey="_id"
                  scroll={{ x: 600 }}
                />
              </Card>
            )}

            {/* Prescriptions */}
            {selectedKey === '4' && (
              <Card
                title="💊 Đơn thuốc"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                <Table
                  columns={prescriptionsColumns}
                  dataSource={prescriptions}
                  pagination={{ pageSize: 10 }}
                  rowKey="_id"
                  scroll={{ x: 700 }}
                />
              </Card>
            )}

            {/* Insurance */}
            {selectedKey === '5' && (
              <Card
                title="🛡️ Bảo hiểm"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                {patientData?.insurance ? (
                  <Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} bordered>
                    <Descriptions.Item label="Công ty bảo hiểm">
                      {patientData.insurance.provider}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số bảo hiểm">
                      {patientData.insurance.policyNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày hiệu lực">
                      {new Date(patientData.insurance.effectiveDate).toLocaleDateString('vi-VN')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày hết hạn">
                      {new Date(patientData.insurance.expiryDate).toLocaleDateString('vi-VN')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái" span={2}>
                      <Badge
                        status={patientData.insurance.status === 'ACTIVE' ? 'success' : 'error'}
                        text={patientData.insurance.status === 'ACTIVE' ? '✅ Hoạt động' : '❌ Hết hạn'}
                      />
                    </Descriptions.Item>
                  </Descriptions>
                ) : (
                  <Empty description="Chưa có thông tin bảo hiểm" />
                )}
              </Card>
            )}

            {/* Bills/Invoices */}
            {selectedKey === '5.5' && (
              <Card
                title="💳 Hóa đơn"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                <Table
                  columns={billsColumns}
                  dataSource={bills}
                  pagination={{ pageSize: 10 }}
                  rowKey="_id"
                  scroll={{ x: 800 }}
                />
              </Card>
            )}

            {/* Profile */}
            {selectedKey === '6' && (
              <Card
                title="👤 Thông tin cá nhân"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                <Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} bordered>
                  <Descriptions.Item label="Email">
                    {user?.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Vai trò">
                    <Tag color="blue">{user?.role}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Họ">
                    {user?.personalInfo?.firstName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên">
                    {user?.personalInfo?.lastName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {user?.personalInfo?.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giới tính">
                    {user?.personalInfo?.gender === 'MALE' ? '👨 Nam' : '👩 Nữ'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày sinh">
                    {user?.personalInfo?.dateOfBirth
                      ? new Date(user.personalInfo.dateOfBirth).toLocaleDateString('vi-VN')
                      : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tạo">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleString('vi-VN')
                      : '-'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          </Spin>
        </Content>
      </Layout>

      {/* Medical Record Detail Drawer */}
      <Drawer
        title="📄 Chi tiết hồ sơ y tế"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedRecord && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Ngày">
              {new Date(selectedRecord.date).toLocaleString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item label="Loại">{selectedRecord.type}</Descriptions.Item>
            <Descriptions.Item label="Mô tả">{selectedRecord.description}</Descriptions.Item>
            <Descriptions.Item label="Bác sĩ">{selectedRecord.doctorName}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú">{selectedRecord.notes || '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </Layout>
  );
};

export default PatientDashboard;
