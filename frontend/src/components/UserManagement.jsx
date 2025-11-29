import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  message,
  Drawer,
  Descriptions,
  Badge,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Tooltip,
  Divider,
  Switch,
  Empty,
  DatePicker
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  SafetyOutlined,
  RestOutlined,
  UndoOutlined
} from '@ant-design/icons';
import { apiClient } from '../utils/api';
import RoleAssignmentModal from './RoleAssignmentModal';
import PermissionsViewer from './PermissionsViewer';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [permissionsDrawerVisible, setPermissionsDrawerVisible] = useState(false);
  const [viewDeletedModalVisible, setViewDeletedModalVisible] = useState(false);
  const [selectedFormRole, setSelectedFormRole] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const [form] = Form.useForm();

  // Password validator - must have: 8+ chars, 1 uppercase, 1 lowercase, 1 digit
  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng nhập mật khẩu'));
    }
    if (value.length < 8) {
      return Promise.reject(new Error('Mật khẩu phải có ít nhất 8 ký tự'));
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject(new Error('Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa'));
    }
    if (!/[a-z]/.test(value)) {
      return Promise.reject(new Error('Mật khẩu phải chứa ít nhất 1 chữ cái viết thường'));
    }
    if (!/[0-9]/.test(value)) {
      return Promise.reject(new Error('Mật khẩu phải chứa ít nhất 1 chữ số'));
    }
    return Promise.resolve();
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize, filterRole, filterStatus, searchText]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        message.error('Vui lòng đăng nhập lại');
        return;
      }

      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...(filterRole !== 'all' && { role: filterRole }),
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(searchText && { search: searchText })
      };

      const response = await apiClient.get(`/users`, {
        params
      });

      if (response.data.success) {
        const usersData = response.data.data.users || response.data.data || [];
        setUsers(usersData);
        setPagination({
          ...pagination,
          total: response.data.data.total || usersData.length
        });
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setDrawerVisible(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditMode(true);
    setSelectedFormRole(user.role);
    
    // Split full name into firstName and lastName
    const nameParts = user.name?.split(' ') || [];
    const firstName = nameParts.slice(0, -1).join(' ') || '';
    const lastName = nameParts[nameParts.length - 1] || '';
    
    form.setFieldsValue({
      email: user.email,
      firstName: firstName,
      lastName: lastName,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
      gender: user.gender,
      role: user.role,
      status: user.status,
      licenseNumber: user.professionalInfo?.licenseNumber,
      specialization: user.professionalInfo?.specialization,
      department: user.professionalInfo?.department
    });
    setModalVisible(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setEditMode(false);
    setSelectedFormRole(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleToggleStatus = async (user) => {
    try {
      const token = localStorage.getItem('accessToken');
      const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      
      await apiClient.patch(
        `/users/${user._id}/disable`,
        { isActive: newStatus === 'ACTIVE' }
      );
      
      message.success(`${newStatus === 'ACTIVE' ? 'Kích hoạt' : 'Vô hiệu hóa'} người dùng thành công`);
      fetchUsers();
    } catch (err) {
      message.error('Không thể cập nhật trạng thái');
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await apiClient.delete(
        `/users/${userId}`
      );
      
      message.success('Xóa người dùng thành công');
      fetchUsers();
    } catch (err) {
      message.error(err.response?.data?.error || 'Không thể xóa người dùng');
      console.error(err);
    }
  };

  const handleEnableUser = async (userId) => {
    try {
      await apiClient.patch(
        `/users/${userId}/enable`,
        {}
      );
      
      message.success('Kích hoạt người dùng thành công');
      fetchUsers();
    } catch (err) {
      message.error('Không thể kích hoạt người dùng');
      console.error(err);
    }
  };

  const handleRestoreUser = async (userId) => {
    try {
      await apiClient.patch(
        `/users/${userId}/restore`,
        {}
      );
      
      message.success('Khôi phục người dùng thành công');
      fetchDeletedUsers();
      fetchUsers();
    } catch (err) {
      message.error('Không thể khôi phục người dùng');
      console.error(err);
    }
  };

  const fetchDeletedUsers = async () => {
    try {
      const response = await apiClient.get(
        `/users/deleted/list`
      );
      
      if (response.data.success) {
        setDeletedUsers(response.data.data || []);
      }
    } catch (err) {
      message.error('Không thể tải danh sách người dùng đã xóa');
      console.error(err);
    }
  };

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setRoleModalVisible(true);
  };

  const handleOpenPermissions = (user) => {
    setSelectedUser(user);
    setPermissionsDrawerVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      // Convert dateOfBirth to ISO format
      let dateOfBirth;
      if (values.dateOfBirth) {
        // Nếu là string từ input type="date" (YYYY-MM-DD)
        if (typeof values.dateOfBirth === 'string') {
          dateOfBirth = new Date(values.dateOfBirth + 'T00:00:00Z').toISOString();
        } 
        // Nếu là dayjs object
        else if (values.dateOfBirth.format) {
          const dateStr = values.dateOfBirth.format('YYYY-MM-DD');
          dateOfBirth = new Date(dateStr + 'T00:00:00Z').toISOString();
        }
      } else {
        dateOfBirth = new Date('1990-01-01T00:00:00Z').toISOString();
      }

      const medicalRoles = ['DOCTOR', 'NURSE', 'PHARMACIST', 'LAB_TECHNICIAN'];
      
      const userData = {
        email: values.email,
        name: `${values.firstName} ${values.lastName}`.trim(),
        phone: values.phone,
        dateOfBirth: dateOfBirth,
        gender: values.gender || 'OTHER',
        role: values.role
      };

      // Add professional info for medical roles - must not use default "N/A" or "General"
      if (medicalRoles.includes(values.role)) {
        userData.professionalInfo = {
          licenseNumber: values.licenseNumber || '',
          specialization: values.specialization || '',
          department: values.department || ''
        };
      }

      // Add password only if provided (required for create, optional for update)
      if (values.password) {
        userData.password = values.password;
        userData.confirmPassword = values.password;
      }

      console.log('📤 Payload gửi:', JSON.stringify(userData, null, 2));

      if (editMode && selectedUser) {
        // Update user - remove password if not changing it
        if (!values.password) {
          delete userData.password;
          delete userData.confirmPassword;
        }
        await apiClient.put(
          `/users/${selectedUser._id}`,
          userData
        );
        message.success('Cập nhật người dùng thành công');
      } else {
        // Create user - password required
        if (!values.password) {
          message.error('Mật khẩu là bắt buộc khi tạo người dùng');
          return;
        }
        await apiClient.post(
          `/users`,
          userData
        );
        message.success('Tạo người dùng thành công');
      }

      setModalVisible(false);
      setSelectedFormRole(null);
      form.resetFields();
      fetchUsers();
    } catch (err) {
      console.error('Submit error response:', err.response?.data);
      
      // Try to extract error details from different response structures
      const errorData = err.response?.data;
      let errorMsg = 'Có lỗi xảy ra';
      let details = null;

      if (errorData) {
        // Check different possible error response structures
        if (errorData.error?.message) {
          errorMsg = errorData.error.message;
          details = errorData.error?.details;
        } else if (errorData.message) {
          errorMsg = errorData.message;
          details = errorData.details;
        } else if (typeof errorData.error === 'string') {
          errorMsg = errorData.error;
        }
      }

      // Show detailed validation errors if available
      if (details && Array.isArray(details)) {
        const detailsText = details
          .map(d => `• ${d.field}: ${d.message}`)
          .join('\n');
        message.error({
          content: (
            <div>
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Lỗi xác thực:</div>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                {detailsText}
              </div>
            </div>
          ),
          duration: 5
        });
      } else {
        message.error(errorMsg);
      }
    }
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <Space>
          <MailOutlined style={{ color: '#1890ff' }} />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: 'Họ tên',
      key: 'name',
      render: (_, record) => (
        <Space>
          <UserOutlined style={{ color: '#52c41a' }} />
          <span>{record.name || 'N/A'}</span>
        </Space>
      )
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => text ? (
        <Space>
          <PhoneOutlined />
          <span>{text}</span>
        </Space>
      ) : '-'
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Super Admin', value: 'SUPER_ADMIN' },
        { text: 'Admin', value: 'ADMIN' },
        { text: 'Bác sĩ', value: 'DOCTOR' },
        { text: 'Bệnh nhân', value: 'PATIENT' }
      ],
      render: (role) => {
        const colors = {
          SUPER_ADMIN: 'red',
          ADMIN: 'orange',
          DOCTOR: 'blue',
          PATIENT: 'green'
        };
        const labels = {
          SUPER_ADMIN: 'Super Admin',
          ADMIN: 'Admin',
          DOCTOR: 'Bác sĩ',
          PATIENT: 'Bệnh nhân'
        };
        return <Tag color={colors[role]}>{labels[role] || role}</Tag>;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Hoạt động', value: 'ACTIVE' },
        { text: 'Không hoạt động', value: 'INACTIVE' },
        { text: 'Bị khóa', value: 'LOCKED' }
      ],
      render: (status) => {
        const config = {
          ACTIVE: { color: 'success', text: 'Hoạt động' },
          INACTIVE: { color: 'default', text: 'Không hoạt động' },
          LOCKED: { color: 'error', text: 'Bị khóa' }
        };
        return <Badge status={config[status]?.color} text={config[status]?.text || status} />;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 300,
      render: (_, record) => (
        <Space wrap>
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewUser(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="Gán vai trò">
            <Button
              icon={<SafetyOutlined />}
              size="small"
              onClick={() => handleOpenRoleModal(record)}
              style={{ color: '#faad14' }}
            />
          </Tooltip>
          <Tooltip title="Xem quyền">
            <Button
              icon={<LockOutlined />}
              size="small"
              onClick={() => handleOpenPermissions(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title={record.isActive === false ? 'Kích hoạt' : 'Vô hiệu hóa'}>
            <Button
              icon={record.isActive === false ? <UnlockOutlined /> : <LockOutlined />}
              size="small"
              onClick={() => record.isActive === false ? handleEnableUser(record._id) : handleToggleStatus(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này?"
            description="Người dùng sẽ được di chuyển vào thư mục đã xóa và có thể khôi phục sau."
            onConfirm={() => handleDeleteUser(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button danger icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'ACTIVE').length,
    doctors: users.filter(u => u.role === 'DOCTOR').length,
    patients: users.filter(u => u.role === 'PATIENT').length
  };

  return (
    <div>
      {/* Statistics */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={stats.total}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={stats.active}
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Bác sĩ"
              value={stats.doctors}
              prefix={<IdcardOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Bệnh nhân"
              value={stats.patients}
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Actions */}
      <Card className="mb-4">
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space wrap>
            <Search
              placeholder="Tìm kiếm theo email, tên..."
              allowClear
              style={{ width: 250 }}
              onSearch={setSearchText}
              prefix={<SearchOutlined />}
            />
            <Select
              style={{ width: 150 }}
              placeholder="Vai trò"
              value={filterRole}
              onChange={setFilterRole}
            >
              <Option value="all">Tất cả vai trò</Option>
              <Option value="SUPER_ADMIN">Super Admin</Option>
              <Option value="ADMIN">Admin</Option>
              <Option value="DOCTOR">Bác sĩ</Option>
              <Option value="PATIENT">Bệnh nhân</Option>
            </Select>
            <Select
              style={{ width: 150 }}
              placeholder="Trạng thái"
              value={filterStatus}
              onChange={setFilterStatus}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="ACTIVE">Hoạt động</Option>
              <Option value="INACTIVE">Không hoạt động</Option>
              <Option value="LOCKED">Bị khóa</Option>
            </Select>
            <Button icon={<ReloadOutlined />} onClick={fetchUsers}>
              Làm mới
            </Button>
            <Button icon={<DeleteOutlined />} onClick={() => {
              fetchDeletedUsers();
              setViewDeletedModalVisible(true);
            }}>
              Xem đã xóa
            </Button>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateUser}>
            Thêm người dùng
          </Button>
        </Space>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* User Detail Drawer */}
      <Drawer
        title="Chi tiết người dùng"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedUser && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
            <Descriptions.Item label="Họ tên">
              {selectedUser.name || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedUser.phone || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              <Tag color={
                selectedUser.role === 'SUPER_ADMIN' ? 'red' :
                selectedUser.role === 'ADMIN' ? 'orange' :
                selectedUser.role === 'DOCTOR' ? 'blue' : 'green'
              }>
                {selectedUser.role}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Badge
                status={selectedUser.status === 'ACTIVE' ? 'success' : 'error'}
                text={selectedUser.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(selectedUser.createdAt).toLocaleString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item label="Đăng nhập lần cuối">
              {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString('vi-VN') : 'Chưa đăng nhập'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      {/* Create/Edit User Modal */}
      <Modal
        title={editMode ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedFormRole(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="email@example.com" disabled={editMode} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="Họ"
                rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nguyễn" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Tên"
                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Văn A" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateOfBirth"
                label="Ngày sinh"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
              >
                <Input type="date" style={{ width: '100%', height: '32px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
              >
                <select 
                  style={{ 
                    width: '100%', 
                    height: '32px', 
                    border: '1px solid #d9d9d9', 
                    borderRadius: '6px',
                    padding: '0 8px',
                    fontSize: '14px'
                  }}
                  onChange={(e) => form.setFieldValue('gender', e.target.value)}
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải có 10-11 chữ số' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="0987654321" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <select 
              style={{ 
                width: '100%', 
                height: '32px', 
                border: '1px solid #d9d9d9', 
                borderRadius: '6px',
                padding: '0 8px',
                fontSize: '14px'
              }}
              onChange={(e) => {
                form.setFieldValue('role', e.target.value);
                setSelectedFormRole(e.target.value);
              }}
            >
              <option value="">-- Chọn vai trò --</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="DOCTOR">Bác sĩ</option>
              <option value="NURSE">Y tá</option>
              <option value="PHARMACIST">Dược sĩ</option>
              <option value="LAB_TECHNICIAN">Kỹ thuật viên phòng lab</option>
              <option value="RECEPTIONIST">Lễ tân</option>
              <option value="BILLING_STAFF">Nhân viên thanh toán</option>
              <option value="PATIENT">Bệnh nhân</option>
            </select>
          </Form.Item>

          {/* Medical Professional Fields */}
          {['DOCTOR', 'NURSE', 'PHARMACIST', 'LAB_TECHNICIAN'].includes(selectedFormRole) && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="licenseNumber"
                    label="Số giấy phép"
                    rules={[{ required: true, message: 'Vui lòng nhập số giấy phép' }]}
                  >
                    <Input placeholder="Nhập số giấy phép hành nghề" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="specialization"
                    label="Chuyên khoa"
                    rules={[{ required: true, message: 'Vui lòng nhập chuyên khoa' }]}
                  >
                    <Input placeholder="VD: Tim mạch, Nhi, v.v" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="department"
                label="Khoa/Phòng"
                rules={[{ required: true, message: 'Vui lòng nhập khoa/phòng' }]}
              >
                <Input placeholder="VD: Khoa Tim mạch, Phòng Khám chung" />
              </Form.Item>
            </>
          )}

          {!editMode && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ validator: validatePassword }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Nhập mật khẩu (ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số)" 
              />
            </Form.Item>
          )}

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editMode ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Role Assignment Modal */}
      <RoleAssignmentModal
        visible={roleModalVisible}
        user={selectedUser}
        onCancel={() => setRoleModalVisible(false)}
        onSuccess={() => {
          setRoleModalVisible(false);
          fetchUsers();
        }}
      />

      {/* Permissions Viewer Drawer */}
      <PermissionsViewer
        visible={permissionsDrawerVisible}
        user={selectedUser}
        onClose={() => setPermissionsDrawerVisible(false)}
      />

      {/* Deleted Users Modal */}
      <Modal
        title="Người dùng đã xóa"
        open={viewDeletedModalVisible}
        onCancel={() => setViewDeletedModalVisible(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setViewDeletedModalVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        <Table
          columns={[
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email'
            },
            {
              title: 'Họ tên',
              key: 'name',
              render: (_, record) => record.name || '-'
            },
            {
              title: 'Số điện thoại',
              dataIndex: 'phone',
              key: 'phone'
            },
            {
              title: 'Vai trò',
              dataIndex: 'role',
              key: 'role',
              render: (role) => (
                <Tag color={
                  role === 'SUPER_ADMIN' ? 'red' :
                  role === 'ADMIN' ? 'orange' :
                  role === 'DOCTOR' ? 'blue' : 'green'
                }>
                  {role}
                </Tag>
              )
            },
            {
              title: 'Ngày xóa',
              key: 'deletedAt',
              render: (_, record) => record.deletedAt ? new Date(record.deletedAt).toLocaleString('vi-VN') : '-'
            },
            {
              title: 'Hành động',
              key: 'action',
              render: (_, record) => (
                <Space wrap>
                  <Popconfirm
                    title="Khôi phục người dùng"
                    description="Người dùng sẽ được phục hồi và có thể sử dụng lại."
                    onConfirm={() => handleRestoreUser(record._id)}
                    okText="Khôi phục"
                    cancelText="Hủy"
                  >
                    <Button type="primary" ghost icon={<UndoOutlined />} size="small">
                      Khôi phục
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    title="Xóa vĩnh viễn"
                    description="Hành động này không thể hoàn tác. Dữ liệu người dùng sẽ bị xóa hoàn toàn."
                    onConfirm={() => handleDeleteUser(record._id)}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                  >
                    <Button danger size="small" icon={<DeleteOutlined />}>
                      Xóa vĩnh viễn
                    </Button>
                  </Popconfirm>
                </Space>
              )
            }
          ]}
          dataSource={deletedUsers}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          loading={false}
        />
      </Modal>
    </div>
  );
};

export default UserManagement;