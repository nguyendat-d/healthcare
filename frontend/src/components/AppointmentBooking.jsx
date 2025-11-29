import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Input, Modal, Tag, Avatar, Rate, Calendar, Space, Divider, Form, Radio, message, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import apiClient from '../utils/api';

const AppointmentBooking = (props) => {
  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [doctors, setDoctors] = useState([]); // Danh sách bác sĩ từ API
  const [loading, setLoading] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState(null); // Lưu appointment đã tạo
  const [data, setData] = useState({
    dept: null,
    doc: null,
    date: null,
    slot: null,
    symptoms: '',
    price: 0
  });

  // Danh sách khoa (có thể fetch từ API nếu cần)
  const depts = [
    { key: 'noi', label: 'Khoa Nội', color: '#1890ff' },
    { key: 'nhi', label: 'Khoa Nhi', color: '#13c2c2' },
    { key: 'da', label: 'Khoa Da Liễu', color: '#eb2f96' },
    { key: 'tim', label: 'Khoa Tim Mạch', color: '#f5222d' },
    { key: 'all', label: 'Tất cả khoa', color: '#52c41a' }
  ];

  // Fetch danh sách bác sĩ từ API
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async (department = null) => {
    try {
      setLoading(true);
      let url = '/users/doctors/booking';
      if (department && department !== 'all') {
        url += `?department=${encodeURIComponent(department)}`;
      }
      
      const response = await apiClient.get(url);
      
      if (response.data.success) {
        setDoctors(response.data.data || []);
      } else {
        setDoctors([]);
      }
    } catch (error) {
      console.error('❌ Lỗi fetch doctors:', error);
      message.error('Không thể tải danh sách bác sĩ');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Khi chọn khoa, fetch lại danh sách bác sĩ theo khoa đó
  const handleSelectDept = (deptKey) => {
    setData({ ...data, dept: deptKey, doc: null, date: null, slot: null, price: 0 });
    const selectedDept = depts.find(d => d.key === deptKey);
    if (selectedDept) {
      fetchDoctors(selectedDept.label);
    }
    setStep(1);
  };

  // Lọc bác sĩ theo khoa đã chọn
  const getFilteredDoctors = () => {
    if (!data.dept || data.dept === 'all') return doctors;
    const selectedDept = depts.find(d => d.key === data.dept);
    if (!selectedDept) return doctors;
    
    return doctors.filter(doc => 
      doc.department?.toLowerCase().includes(selectedDept.label.toLowerCase().replace('Khoa ', '')) ||
      selectedDept.label.toLowerCase().includes(doc.department?.toLowerCase())
    );
  };

  const slots = [
    '08:00 - 08:30', '08:30 - 09:00', '09:00 - 09:30', '09:30 - 10:00',
    '10:00 - 10:30', '10:30 - 11:00', '13:00 - 13:30', '13:30 - 14:00',
    '14:00 - 14:30', '14:30 - 15:00', '15:00 - 15:30', '15:30 - 16:00'
  ];

  const handleReset = () => {
    setStep(0);
    setData({ dept: null, doc: null, date: null, slot: null, symptoms: '', price: 0 });
    setPaymentMethod(null);
    setCreatedAppointment(null);
  };

  // 🆕 Tạo appointment trước khi hiện thanh toán (để có mã AP)
  const handleShowPayment = async () => {
    try {
      if (!data.doc || !data.date || !data.slot) {
        message.error('Vui lòng chọn đầy đủ thông tin trước');
        return;
      }

      const patientId = props.user?._id;
      if (!patientId) {
        message.error('Vui lòng đăng nhập lại');
        return;
      }

      setLoading(true);

      const selectedDoctor = doctors.find(d => d.id === data.doc);
      const slotStartTime = data.slot.split(' - ')[0];
      const appointmentDateTime = data.date.format('YYYY-MM-DD') + 'T' + slotStartTime + ':00';

      // Tạo appointment với trạng thái chờ thanh toán
      const appointmentPayload = {
        patientId: patientId,
        doctorId: data.doc,
        appointmentDate: appointmentDateTime,
        type: 'CONSULTATION',
        mode: 'IN_PERSON',
        location: selectedDoctor?.department || 'Bệnh viện',
        room: 'P.101',
        reason: data.symptoms || 'Khám bệnh',
        symptoms: data.symptoms ? [data.symptoms] : [],
        duration: 30
      };

      console.log('📅 Creating appointment for payment:', appointmentPayload);
      const createRes = await apiClient.post('/appointments', appointmentPayload);
      const newAppointment = createRes.data.data;
      
      console.log('✅ Appointment created:', newAppointment.appointmentId);
      setCreatedAppointment(newAppointment);
      setShowPayment(true);
      
      message.info(`Mã lịch hẹn: ${newAppointment.appointmentId} - Vui lòng thanh toán`);

    } catch (err) {
      console.error('❌ Lỗi tạo lịch hẹn:', err);
      message.error(err.response?.data?.message || 'Không thể tạo lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Kiểm tra đã có appointment chưa
      if (!createdAppointment) {
        message.error('Chưa tạo lịch hẹn. Vui lòng thử lại.');
        return;
      }

      const appointmentId = createdAppointment.appointmentId;

      // Nếu thanh toán QR - chỉ thông báo chờ xác nhận tự động
      if (paymentMethod === 'qr') {
        message.success(
          `✅ Đã tạo lịch hẹn ${appointmentId}. Hệ thống sẽ tự động xác nhận sau khi nhận được chuyển khoản!`,
          5
        );
        
        if (props.onSuccess) {
          props.onSuccess();
        }
        
        setShowPayment(false);
        handleReset();
        return;
      }

      // Nếu thanh toán khác (tiền mặt, ví) - confirm ngay
      await apiClient.post(`/appointments/${appointmentId}/payment/confirm`, {
        method: paymentMethod === 'bank' ? 'BANK_TRANSFER' : paymentMethod === 'wallet' ? 'CASH' : 'CASH',
        amount: data.price || 5000,
        notes: 'Thanh toán tại quầy'
      });
      
      message.success(`Thanh toán thành công! Mã khám: ${appointmentId}`);
      
      if (props.onSuccess) {
        props.onSuccess();
      }
      
      setShowPayment(false);
      handleReset();
    } catch (err) {
      console.error('❌ Lỗi thanh toán:', err.response?.data || err.message);
      message.error(err.response?.data?.message || 'Thanh toán thất bại, vui lòng thử lại');
    }
  };

  // Helper: Lấy thông tin bác sĩ đã chọn
  const getSelectedDoctor = () => {
    return doctors.find(d => d.id === data.doc);
  };

  const styles = {
    fadeIn: { animation: 'fadeIn 0.5s ease-in' },
    slideIn: (delay = 0) => ({ animation: `slideIn 0.3s ease ${delay}s both` }),
    card: { transition: 'all 0.3s ease', borderRadius: '12px' }
  };

  return (
    <div style={styles.fadeIn}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0', color: '#1890ff' }}>
          Đặt Lịch Khám
        </h1>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '15px', flex: 1 }}>
            Quản lý lịch khám của bạn một cách dễ dàng và nhanh chóng
          </p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#999' }}>
            <span style={{ background: '#f0f0f0', padding: '4px 12px', borderRadius: '4px' }}>Bước {step + 1}/6</span>
          </div>
        </div>
      </div>

      <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
        {/* Progress */}
        <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'center' }}>
            {[0, 1, 2, 3, 4, 5].map((s, idx) => (
              <div key={idx} style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: s < step ? '#52c41a' : s === step ? '#1890ff' : '#f0f0f0',
                    color: s === step ? '#fff' : s < step ? '#fff' : '#999',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '14px', transition: 'all 0.3s ease'
                  }}>
                    {s < step ? '✓' : s + 1}
                  </div>
                  {idx < 5 && <div style={{ flex: 1, height: '2px', background: s < step ? '#52c41a' : '#f0f0f0', transition: 'all 0.3s ease' }} />}
                </div>
                <div style={{ fontSize: '11px', textAlign: 'center', marginTop: '6px', color: '#999', fontWeight: '500' }}>
                  {['Khoa', 'Bác sĩ', 'Ngày', 'Giờ', 'Triệu chứng', 'Xác nhận'][idx]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Department */}
        {step === 0 && (
          <div style={styles.slideIn()}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 20px 0', color: '#262626' }}>
              Chọn Chuyên Khoa Bạn Muốn Khám
            </h3>
            <Row gutter={[16, 16]}>
              {depts.map((d, idx) => (
                <Col xs={24} sm={12} lg={6} key={d.key} style={styles.slideIn(idx * 0.08)}>
                  <div onClick={() => handleSelectDept(d.key)}
                    style={{
                      ...styles.card, padding: '24px 16px', background: data.dept === d.key ? `linear-gradient(135deg, ${d.color}12, ${d.color}06)` : '#fff',
                      border: data.dept === d.key ? `2px solid ${d.color}` : '1px solid #e8e8e8', cursor: 'pointer', minHeight: '140px',
                      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                    }}>
                    <div style={{
                      width: '50px', height: '50px', borderRadius: '50%', background: `${d.color}15`, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', marginBottom: '12px', fontSize: '24px', fontWeight: '700', color: d.color
                    }}>
                      {d.label.charAt(5)}
                    </div>
                    <div style={{ fontWeight: '700', color: '#262626', fontSize: '15px', lineHeight: '1.3', marginBottom: '8px' }}>
                      {d.label}
                    </div>
                    {data.dept === d.key && <div style={{ color: d.color, fontSize: '12px', fontWeight: '600', marginTop: '8px' }}>✓ Đã chọn</div>}
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Step 2: Doctor */}
        {step === 1 && (
          <div style={styles.slideIn()}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 20px 0', color: '#262626' }}>
              Chọn Bác Sĩ Bạn Muốn Khám
            </h3>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" />
                <p style={{ marginTop: '16px', color: '#666' }}>Đang tải danh sách bác sĩ...</p>
              </div>
            ) : doctors.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: '#fafafa', borderRadius: '12px' }}>
                <p style={{ fontSize: '16px', color: '#666' }}>Không có bác sĩ nào khả dụng cho khoa này.</p>
                <p style={{ fontSize: '14px', color: '#999' }}>Vui lòng chọn khoa khác hoặc liên hệ bệnh viện.</p>
              </div>
            ) : (
              <Row gutter={[16, 16]}>
                {doctors.map((doc, idx) => (
                  <Col xs={24} sm={12} key={doc.id} style={styles.slideIn(idx * 0.08)}>
                    <div onClick={() => setData({ ...data, doc: doc.id, price: doc.consultationFee || 5000})}
                      style={{
                        ...styles.card, background: data.doc === doc.id ? '#f0f7ff' : '#fff', border: data.doc === doc.id ? '2px solid #1890ff' : '1px solid #e8e8e8',
                        cursor: 'pointer', borderRadius: '12px', padding: '18px'
                      }}>
                      <Row gutter={16} align="middle">
                        <Col xs={0} sm={6}>
                          <Avatar size={72} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', fontSize: '32px' }} />
                        </Col>
                        <Col xs={24} sm={18}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <h4 style={{ margin: 0, fontWeight: '700', fontSize: '16px', color: '#262626' }}>{doc.name}</h4>
                            {data.doc === doc.id && <Tag color="blue">Đã chọn</Tag>}
                          </div>
                          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#666', marginBottom: '10px', flexWrap: 'wrap' }}>
                            <span>{doc.specialization}</span> 
                            <span>•</span> 
                            <span>{doc.yearsOfExperience} năm kinh nghiệm</span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                            {doc.department}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Rate disabled defaultValue={4.5} allowHalf style={{ fontSize: '12px' }} />
                            <span style={{ color: '#1890ff', fontWeight: '700', fontSize: '16px' }}>
                              {(doc.consultationFee || 5000).toLocaleString('vi-VN')} ₫
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
            <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between' }}>
              <Button size="large" onClick={() => setStep(0)} style={{ borderRadius: '8px', height: '40px', minWidth: '100px', fontSize: '15px' }}>
                Quay lại
              </Button>
              <Button type="primary" size="large" onClick={() => setStep(2)} disabled={!data.doc}
                style={{ borderRadius: '8px', height: '40px', minWidth: '120px', fontSize: '15px', fontWeight: '600' }}>
                Tiếp tục
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Date */}
        {step === 2 && (
          <div style={styles.slideIn()}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 20px 0', color: '#262626' }}>Chọn Ngày Khám</h3>
            <Row gutter={[20, 20]}>
              <Col xs={24} lg={16}>
                <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '16px', border: '1px solid #f0f0f0' }}>
                  <Calendar fullscreen={false} value={data.date} onChange={(d) => setData({ ...data, date: d })} />
                </div>
              </Col>
              <Col xs={24} lg={8}>
                <div style={{ background: '#fafafa', borderRadius: '12px', padding: '16px', border: '1px solid #f0f0f0', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '16px', color: '#262626' }}>Thông tin</div>
                  <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #b3e5fc' }}>
                    <div style={{ fontSize: '12px', color: '#0288d1', fontWeight: '600', marginBottom: '4px' }}>Ngày có trống</div>
                    <div style={{ fontSize: '13px', color: '#0277bd', fontWeight: '500' }}>Thứ Hai - Thứ Sáu</div>
                  </div>
                  <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                    <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>Ngày đã đủ</div>
                    <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Thứ Bảy - Chủ Nhật</div>
                  </div>
                  {data.date && (
                    <div style={{ marginTop: 'auto', padding: '14px', backgroundColor: '#e6f7ff', borderRadius: '8px', border: '1px solid #91d5ff' }}>
                      <div style={{ fontSize: '12px', color: '#1890ff', fontWeight: '600', marginBottom: '6px' }}>Ngày được chọn</div>
                      <div style={{ fontSize: '16px', color: '#1890ff', fontWeight: '700' }}>{data.date.format('DD/MM/YYYY')}</div>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between' }}>
              <Button size="large" onClick={() => setStep(1)} style={{ borderRadius: '8px', height: '40px', minWidth: '100px', fontSize: '15px' }}>
                Quay lại
              </Button>
              <Button type="primary" size="large" onClick={() => setStep(3)} disabled={!data.date}
                style={{ borderRadius: '8px', height: '40px', minWidth: '120px', fontSize: '15px', fontWeight: '600' }}>
                Tiếp tục
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Time */}
        {step === 3 && (
          <div style={styles.slideIn()}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 16px 0', color: '#262626' }}>Chọn Khung Giờ Khám</h3>
            <div style={{ marginBottom: '20px', padding: '12px 16px', backgroundColor: '#f5f5f5', borderRadius: '8px', border: '1px solid #e8e8e8', fontSize: '14px', color: '#666', fontWeight: '500' }}>
              📅 Ngày khám: <span style={{ color: '#1890ff', fontWeight: '700' }}>{data.date?.format('DD/MM/YYYY')}</span>
            </div>
            <Row gutter={[10, 10]}>
              {slots.map((s, idx) => {
                const avail = idx % 3 !== 0;
                return (
                  <Col xs={12} sm={8} md={6} key={idx} style={styles.slideIn(idx * 0.03)}>
                    <button onClick={() => setData({ ...data, slot: s })} disabled={!avail && data.slot !== s}
                      style={{
                        width: '100%', background: data.slot === s ? '#1890ff' : avail ? '#fff' : '#f5f5f5',
                        border: data.slot === s ? '2px solid #1890ff' : avail ? '1px solid #e8e8e8' : '1px solid #f0f0f0',
                        color: data.slot === s ? '#fff' : avail ? '#262626' : '#ccc', cursor: avail ? 'pointer' : 'not-allowed',
                        borderRadius: '8px', fontWeight: '600', fontSize: '13px', padding: 0, transition: 'all 0.2s ease',
                        height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '3px'
                      }}>
                      <div>{s}</div>
                      <div style={{ fontSize: '11px', opacity: 0.7 }}>{avail ? 'Trống' : 'Đặt'}</div>
                    </button>
                  </Col>
                );
              })}
            </Row>
            <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between' }}>
              <Button size="large" onClick={() => setStep(2)} style={{ borderRadius: '8px', height: '40px', minWidth: '100px', fontSize: '15px' }}>
                Quay lại
              </Button>
              <Button type="primary" size="large" onClick={() => setStep(4)} disabled={!data.slot}
                style={{ borderRadius: '8px', height: '40px', minWidth: '120px', fontSize: '15px', fontWeight: '600' }}>
                Tiếp tục
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Symptoms */}
        {step === 4 && (
          <div style={styles.slideIn()}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 20px 0', color: '#262626' }}>Mô Tả Triệu Chứng</h3>
            <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '20px', border: '1px solid #f0f0f0' }}>
              <Form layout="vertical">
                <Form.Item label={<span style={{ fontWeight: '600', fontSize: '14px' }}>Triệu chứng hoặc tình trạng bệnh *</span>} required>
                  <Input.TextArea rows={6} placeholder="Vui lòng mô tả chi tiết các triệu chứng, bệnh lý, dị ứng thuốc..."
                    value={data.symptoms} onChange={(e) => setData({ ...data, symptoms: e.target.value })}
                    style={{ borderRadius: '8px', borderColor: '#d9d9d9', fontSize: '14px' }} maxLength={500} showCount />
                </Form.Item>
                <Form.Item label={<span style={{ fontWeight: '600', fontSize: '14px' }}>Loại khám</span>}>
                  <Radio.Group style={{ fontSize: '14px' }}>
                    <Radio value="first" style={{ marginBottom: '10px' }}>Lần đầu khám</Radio>
                    <Radio value="repeat">Tái khám</Radio>
                  </Radio.Group>
                </Form.Item>
              </Form>
            </div>
            <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between' }}>
              <Button size="large" onClick={() => setStep(3)} style={{ borderRadius: '8px', height: '40px', minWidth: '100px', fontSize: '15px' }}>
                Quay lại
              </Button>
              <Button type="primary" size="large" onClick={() => setStep(5)} disabled={!data.symptoms || data.symptoms.trim().length < 10}
                style={{ borderRadius: '8px', height: '40px', minWidth: '120px', fontSize: '15px', fontWeight: '600' }}>
                Tiếp tục
              </Button>
            </div>
          </div>
        )}

        {/* Step 6: Review */}
        {step === 5 && (
          <div style={styles.slideIn()}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 20px 0', color: '#262626' }}>Xác Nhận Thông Tin</h3>
            <Row gutter={[20, 20]}>
              <Col xs={24} lg={14}>
                <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '20px', border: '1px solid #f0f0f0', marginBottom: '20px' }}>
                  <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '16px', color: '#262626' }}>Thông tin đặt lịch</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Chuyên khoa</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#262626' }}>
                        {depts.find(d => d.key === data.dept)?.label}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Bác sĩ</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#262626' }}>
                        {getSelectedDoctor()?.name || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Ngày khám</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1890ff' }}>{data.date?.format('DD/MM/YYYY')}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Khung giờ</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1890ff' }}>{data.slot}</div>
                    </div>
                  </div>
                  <div style={{ paddingTop: '16px', borderTop: '1px solid #e8e8e8' }}>
                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>Triệu chứng</div>
                    <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', fontStyle: 'italic' }}>{data.symptoms}</div>
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={10}>
                <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '20px', border: '1px solid #f0f0f0', marginBottom: '20px' }}>
                  <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '16px', color: '#262626' }}>Chi phí dịch vụ</div>
                  <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', paddingBottom: '12px', borderBottom: '1px solid #e8e8e8' }}>
                    <span>Khám ban đầu</span>
                    <strong>{data.price.toLocaleString('vi-VN')} ₫</strong>
                  </div>
                  <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', paddingBottom: '12px', borderBottom: '1px solid #e8e8e8' }}>
                    <span>Phí dịch vụ</span>
                    <strong>3 ₫</strong>
                  </div>
                  <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', paddingBottom: '12px', borderBottom: '2px solid #f0f0f0' }}>
                    <span>Xét nghiệm</span>
                    <strong>3 ₫</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#1890ff' }}>
                    <span>Tổng tiền</span>
                    <span>{data.price.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: '#fffbe6', borderRadius: '8px', border: '1px solid #ffe58f', marginBottom: '20px', fontSize: '13px', color: '#ad6800', lineHeight: '1.5' }}>
                    Vui lòng đến 10 phút trước giờ khám. Thanh toán tại quầy hoặc qua ứng dụng.
                  </div>
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <Button block size="large" type="primary" onClick={handleShowPayment} loading={loading}
                      style={{ borderRadius: '8px', height: '40px', fontSize: '15px', fontWeight: '600' }}>
                      Chọn Phương Thức Thanh Toán
                    </Button>
                    <Button block size="large" onClick={() => setStep(4)}
                      style={{ borderRadius: '8px', height: '40px', fontSize: '15px' }}>
                      Chỉnh sửa
                    </Button>
                  </Space>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Card>

      {/* Payment Modal */}
      <Modal title="Chọn Phương Thức Thanh Toán" open={showPayment} onCancel={() => setShowPayment(false)} footer={null} width={500} centered>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>Chọn cách thanh toán:</div>

          {/* Bank Transfer */}
          <div onClick={() => setPaymentMethod('transfer')}
            style={{
              padding: '16px', border: paymentMethod === 'transfer' ? '2px solid #1890ff' : '1px solid #d9d9d9',
              borderRadius: '8px', cursor: 'pointer', marginBottom: '12px', background: paymentMethod === 'transfer' ? '#f0f7ff' : '#fff', transition: 'all 0.3s ease'
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', border: paymentMethod === 'transfer' ? '6px solid #1890ff' : '2px solid #d9d9d9',
                background: paymentMethod === 'transfer' ? '#1890ff' : '#fff'
              }} />
              <div>
                <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>🏦 Chuyển Khoản Ngân Hàng</div>
                <div style={{ fontSize: '13px', color: '#666' }}>Chuyển tiền trực tiếp từ ngân hàng của bạn</div>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div onClick={() => setPaymentMethod('qr')}
            style={{
              padding: '16px', border: paymentMethod === 'qr' ? '2px solid #1890ff' : '1px solid #d9d9d9',
              borderRadius: '8px', cursor: 'pointer', marginBottom: '12px', background: paymentMethod === 'qr' ? '#f0f7ff' : '#fff', transition: 'all 0.3s ease'
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', border: paymentMethod === 'qr' ? '6px solid #1890ff' : '2px solid #d9d9d9',
                background: paymentMethod === 'qr' ? '#1890ff' : '#fff'
              }} />
              <div>
                <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>🏦 QR Chuyển Khoản Ngân Hàng</div>
                <div style={{ fontSize: '13px', color: '#666' }}>Quét bằng app ngân hàng (MB, VCB, TCB, BIDV...)</div>
              </div>
            </div>
          </div>

          {/* Wallet */}
          <div onClick={() => setPaymentMethod('wallet')}
            style={{
              padding: '16px', border: paymentMethod === 'wallet' ? '2px solid #1890ff' : '1px solid #d9d9d9',
              borderRadius: '8px', cursor: 'pointer', background: paymentMethod === 'wallet' ? '#f0f7ff' : '#fff', transition: 'all 0.3s ease'
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', border: paymentMethod === 'wallet' ? '6px solid #1890ff' : '2px solid #d9d9d9',
                background: paymentMethod === 'wallet' ? '#1890ff' : '#fff'
              }} />
              <div>
                <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>💳 Ví Điện Tử</div>
                <div style={{ fontSize: '13px', color: '#666' }}>Thanh toán từ ví điện tử của bệnh viện</div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        {paymentMethod && (
          <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '16px', marginBottom: '20px', border: '1px solid #f0f0f0' }}>
            <div style={{ fontWeight: '700', marginBottom: '12px', fontSize: '14px' }}>Chi tiết thanh toán:</div>
            {paymentMethod === 'transfer' && (
              <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#666' }}>Ngân hàng:</span> <strong>MBbank</strong>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#666' }}>Số tài khoản:</span> <strong style={{ fontFamily: 'monospace' }}>90024122004</strong>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#666' }}>Chủ tài khoản:</span> <strong>NGUYEN PHUOC DAI</strong>
                </div>
              </div>
            )}
            {paymentMethod === 'qr' && createdAppointment && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ background: '#e6f7ff', padding: '10px', borderRadius: '8px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '14px', color: '#1890ff', fontWeight: '600' }}>
                    📋 Mã lịch hẹn: <span style={{ fontFamily: 'monospace', fontSize: '16px' }}>{createdAppointment.appointmentId}</span>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                  🏦 Quét mã QR bằng <strong>app ngân hàng</strong> để thanh toán
                </p>
                <div style={{ background: '#fff7e6', padding: '8px', borderRadius: '6px', marginBottom: '12px', fontSize: '12px', color: '#d46b08' }}>
                  ⚠️ <strong>QUAN TRỌNG:</strong> Nội dung chuyển khoản phải có mã <strong>{createdAppointment.appointmentId}</strong>
                </div>
                <img 
                  src={`https://img.vietqr.io/image/MB-90024122004-compact2.png?amount=${data.price}&addInfo=${encodeURIComponent(createdAppointment.appointmentId + ' Thanh toan kham benh')}&accountName=NGUYEN%20PHUOC%20DAI`}
                  alt="QR Code Thanh Toán"
                  style={{
                    width: '250px', 
                    height: '300px', 
                    margin: '12px auto', 
                    borderRadius: '8px',
                    border: '1px solid #d9d9d9'
                  }}
                />
                <div style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>
                  <div><strong>Số tiền:</strong> <span style={{ color: '#1890ff', fontWeight: '700' }}>{data.price.toLocaleString('vi-VN')} ₫</span></div>
                  <div><strong>Nội dung:</strong> <span style={{ color: '#52c41a', fontWeight: '600' }}>{createdAppointment.appointmentId} Thanh toan kham benh</span></div>
                </div>
                <div style={{ marginTop: '16px', padding: '12px', background: '#f6ffed', borderRadius: '8px', border: '1px solid #b7eb8f' }}>
                  <div style={{ fontSize: '13px', color: '#52c41a' }}>
                    ✅ Sau khi chuyển khoản, hệ thống sẽ <strong>tự động xác nhận</strong> trong 1-5 phút
                  </div>
                </div>
              </div>
            )}
            {paymentMethod === 'wallet' && (
              <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#666' }}>Số dư:</span> <strong style={{ color: '#52c41a' }}>2.500.000 ₫</strong>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#666' }}>Cần thanh toán:</span> <strong style={{ color: '#1890ff' }}>{data.price.toLocaleString('vi-VN')} ₫</strong>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirm Button */}
        {paymentMethod && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button onClick={() => setShowPayment(false)} style={{ flex: 1, borderRadius: '8px', height: '40px' }}>
              Hủy
            </Button>
            <Button type="primary" onClick={handlePaymentSuccess} style={{ flex: 1, borderRadius: '8px', height: '40px', fontWeight: '600' }}>
              Xác Nhận Thanh Toán
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentBooking;
