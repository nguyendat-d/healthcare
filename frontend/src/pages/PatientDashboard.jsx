import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, message, Spin, Space, Avatar } from 'antd';
import { LogoutOutlined, HomeOutlined, FileTextOutlined, CalendarOutlined, MedicineBoxOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../utils/api';
import PatientPersonalInfo from '../components/PatientPersonalInfo';
import AppointmentsSection from '../components/AppointmentsSection';
import MedicalRecordsSection from '../components/MedicalRecordsSection';
import PrescriptionsSection from '../components/PrescriptionsSection';
import BillingSection from '../components/BillingSection';
import AppointmentBooking from '../components/AppointmentBooking';

const { Header, Sider, Content } = Layout;

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ 
    patient: null, 
    records: [], 
    appointments: [], 
    prescriptions: [], 
    bills: [] 
  });

  useEffect(() => {
    if (user?._id) {
      fetchAllData();
    }
  }, [user?._id]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [demoRes, recordsRes, aptsRes, rxRes, billsRes] = await Promise.allSettled([
        apiClient.get(`/patients/${user._id}/demographics`),
        apiClient.get(`/medical/patient/${user._id}`),
        apiClient.get(`/appointments/patient/${user._id}`),
        apiClient.get(`/prescriptions/patient/${user._id}`),
        apiClient.get(`/billing/patient/${user._id}`)
      ]);

      // Process results safely
      const newData = {
        patient: demoRes.status === 'fulfilled' ? demoRes.value.data.data : null,
        records: recordsRes.status === 'fulfilled' ? Array.isArray(recordsRes.value.data.data) ? recordsRes.value.data.data : [] : [],
        appointments: aptsRes.status === 'fulfilled' ? Array.isArray(aptsRes.value.data.data) ? aptsRes.value.data.data : [] : [],
        prescriptions: rxRes.status === 'fulfilled' ? Array.isArray(rxRes.value.data.data) ? rxRes.value.data.data : [] : [],
        bills: billsRes.status === 'fulfilled' ? Array.isArray(billsRes.value.data.data) ? billsRes.value.data.data : [] : []
      };

      setData(newData);
    } catch (err) {
      console.error('Error fetching data:', err);
      message.error('Lỗi tải dữ liệu. Vui lòng tải lại trang.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
      logout();
      message.success('Đã đăng xuất');
      navigate('/login');
    } catch (err) {
      message.error('Lỗi đăng xuất');
    }
  };

  const menuItems = [
    { key: '1', icon: <HomeOutlined />, label: 'Thông tin cá nhân' },
    { key: '2', icon: <FileTextOutlined />, label: 'Hồ sơ y tế' },
    { key: '3', icon: <CalendarOutlined />, label: 'Lịch khám' },
    { key: '4', icon: <MedicineBoxOutlined />, label: 'Đơn thuốc' },
    { key: '5', icon: <FileTextOutlined />, label: 'Hóa đơn' },
    { key: '6', icon: <CalendarOutlined />, label: 'Đặt lịch khám' }
  ];

  return (
    <Layout className="min-h-screen" style={{ background: '#f0f2f5' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={240} 
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'fixed', left: 0, top: 0, bottom: 0, overflow: 'auto', zIndex: 100 }}>
        <div style={{ padding: '24px 16px', textAlign: 'center', color: '#fff', fontWeight: '700', fontSize: '18px', marginBottom: '24px' }}>
          {!collapsed ? '🏥 Healthcare' : '🏥'}
        </div>
        <Menu mode="inline" selectedKeys={[selectedKey]} onClick={(e) => setSelectedKey(e.key)} items={menuItems}
          style={{ background: 'transparent', border: 'none' }} theme="dark" />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'all 0.3s ease' }}>
        <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 99 }}>
          <Button type="text" size="large" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <Space>
            <span style={{ fontWeight: '500' }}>{user?.email}</span>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
            <Button type="primary" danger onClick={handleLogout} icon={<LogoutOutlined />}>Đăng xuất</Button>
          </Space>
        </Header>

        <Content style={{ padding: '24px', minHeight: 'calc(100vh - 100px)' }}>
          <Spin spinning={loading} delay={500}>
            {selectedKey === '1' && <PatientPersonalInfo patientData={data.patient} />}
            {selectedKey === '2' && <MedicalRecordsSection records={data.records} patient={data.patient} />}
            {selectedKey === '3' && <AppointmentsSection appointments={data.appointments} patient={data.patient} prescriptions={data.prescriptions} bills={data.bills} />}
            {selectedKey === '4' && <PrescriptionsSection prescriptions={data.prescriptions} appointments={data.appointments} records={data.records} />}
            {selectedKey === '5' && <BillingSection bills={data.bills} appointments={data.appointments} patient={data.patient} />}
            {selectedKey === '6' && <AppointmentBooking patient={data.patient} user={user} onSuccess={fetchAllData} />}
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PatientDashboard;
