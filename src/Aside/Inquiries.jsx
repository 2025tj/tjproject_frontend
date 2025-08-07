import React, { useState } from 'react';
import { Card, Button, List, Tag, Modal, Descriptions, Space, Badge, Tabs } from 'antd';
import { 
  ClockCircleOutlined, 
  ExclamationCircleOutlined, 
  CheckCircleOutlined,
  EyeOutlined,
  UserOutlined,
  CalendarOutlined,
  MessageOutlined
} from '@ant-design/icons';
import './Inquiries.css';

const { TabPane } = Tabs;

const Inquiries = () => {
  // 샘플 데이터 - 실제로는 API에서 가져올 데이터
  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      title: "회원가입 관련 문의",
      content: "회원가입 시 이메일 인증이 되지 않습니다. 확인 부탁드립니다.",
      status: "new",
      memberName: "김철수",
      memberEmail: "kim@example.com",
      createdAt: "2024-01-15 14:30:00",
      priority: "high"
    },
    {
      id: 2,
      title: "결제 시스템 오류",
      content: "결제 시 카드 등록이 안 되는 문제가 있습니다.",
      status: "in-progress",
      memberName: "이영희",
      memberEmail: "lee@example.com",
      createdAt: "2024-01-14 09:15:00",
      priority: "medium",
      assignedTo: "관리자1"
    },
    {
      id: 3,
      title: "서비스 이용 문의",
      content: "데이터 분석 기능 사용법에 대해 문의드립니다.",
      status: "completed",
      memberName: "박민수",
      memberEmail: "park@example.com",
      createdAt: "2024-01-13 16:45:00",
      priority: "low",
      completedAt: "2024-01-14 10:30:00",
      solution: "사용자 가이드 문서를 제공했습니다."
    },
    {
      id: 4,
      title: "로그인 오류",
      content: "비밀번호를 잊어버려서 로그인이 안 됩니다.",
      status: "new",
      memberName: "최지영",
      memberEmail: "choi@example.com",
      createdAt: "2024-01-15 11:20:00",
      priority: "high"
    },
    {
      id: 5,
      title: "데이터 업로드 문제",
      content: "엑셀 파일 업로드 시 오류가 발생합니다.",
      status: "in-progress",
      memberName: "정수민",
      memberEmail: "jung@example.com",
      createdAt: "2024-01-12 13:10:00",
      priority: "medium",
      assignedTo: "개발팀"
    }
  ]);

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("new");

  // 상태별 건수 계산
  const getStatusCount = (status) => {
    return inquiries.filter(inquiry => inquiry.status === status).length;
  };

  // 상태별 요청사항 필터링
  const getInquiriesByStatus = (status) => {
    return inquiries.filter(inquiry => inquiry.status === status);
  };

  // 우선순위 색상
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  // 상태별 아이콘과 색상
  const getStatusConfig = (status) => {
    switch (status) {
      case 'new':
        return { icon: <ExclamationCircleOutlined />, color: 'red', text: '새로운 건' };
      case 'in-progress':
        return { icon: <ClockCircleOutlined />, color: 'orange', text: '진행중인 건' };
      case 'completed':
        return { icon: <CheckCircleOutlined />, color: 'green', text: '완료된 건' };
      default:
        return { icon: <MessageOutlined />, color: 'blue', text: '기타' };
    }
  };

  // 요청사항 상세보기
  const showInquiryDetail = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalVisible(true);
  };

  // 상태 변경
  const updateInquiryStatus = (inquiryId, newStatus) => {
    setInquiries(prev => 
      prev.map(inquiry => 
        inquiry.id === inquiryId 
          ? { ...inquiry, status: newStatus }
          : inquiry
      )
    );
  };

  // 요청사항 렌더링
  const renderInquiryItem = (inquiry) => {
    const statusConfig = getStatusConfig(inquiry.status);
    
    return (
      <List.Item
        key={inquiry.id}
        actions={[
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => showInquiryDetail(inquiry)}
          >
            상세보기
          </Button>
        ]}
      >
        <List.Item.Meta
          title={
            <Space>
              <span>{inquiry.title}</span>
              <Tag color={getPriorityColor(inquiry.priority)}>
                {inquiry.priority === 'high' ? '높음' : 
                 inquiry.priority === 'medium' ? '보통' : '낮음'}
              </Tag>
              <Badge 
                status={statusConfig.color} 
                text={statusConfig.text}
              />
            </Space>
          }
          description={
            <Space direction="vertical" size="small">
              <div>
                <UserOutlined /> {inquiry.memberName} ({inquiry.memberEmail})
              </div>
              <div>
                <CalendarOutlined /> {inquiry.createdAt}
              </div>
              <div style={{ color: '#666' }}>
                {inquiry.content.length > 100 
                  ? `${inquiry.content.substring(0, 100)}...` 
                  : inquiry.content}
              </div>
            </Space>
          }
        />
      </List.Item>
    );
  };

  return (
    <div className="inquiries-container">
      <div className="inquiries-header">
        <h2>회원 요청사항 관리</h2>
        <p>총 {inquiries.length}건의 요청사항이 있습니다.</p>
      </div>

      {/* 상태별 요약 카드 */}
      <div className="status-summary">
        <Card 
          className="status-card new"
          onClick={() => setActiveTab("new")}
        >
          <div className="status-card-content">
            <ExclamationCircleOutlined className="status-icon" />
            <div className="status-info">
              <h3>새로운 건</h3>
              <span className="count">{getStatusCount("new")}건</span>
            </div>
          </div>
        </Card>

        <Card 
          className="status-card in-progress"
          onClick={() => setActiveTab("in-progress")}
        >
          <div className="status-card-content">
            <ClockCircleOutlined className="status-icon" />
            <div className="status-info">
              <h3>진행중인 건</h3>
              <span className="count">{getStatusCount("in-progress")}건</span>
            </div>
          </div>
        </Card>

        <Card 
          className="status-card completed"
          onClick={() => setActiveTab("completed")}
        >
          <div className="status-card-content">
            <CheckCircleOutlined className="status-icon" />
            <div className="status-info">
              <h3>완료된 건</h3>
              <span className="count">{getStatusCount("completed")}건</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 요청사항 목록 */}
      <div className="inquiries-content">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          className="inquiries-tabs"
        >
          <TabPane 
            tab={
              <span>
                <ExclamationCircleOutlined />
                새로운 건 ({getStatusCount("new")})
              </span>
            } 
            key="new"
          >
            <List
              itemLayout="vertical"
              dataSource={getInquiriesByStatus("new")}
              renderItem={renderInquiryItem}
              locale={{ emptyText: "새로운 요청사항이 없습니다." }}
            />
          </TabPane>

          <TabPane 
            tab={
              <span>
                <ClockCircleOutlined />
                진행중인 건 ({getStatusCount("in-progress")})
              </span>
            } 
            key="in-progress"
          >
            <List
              itemLayout="vertical"
              dataSource={getInquiriesByStatus("in-progress")}
              renderItem={renderInquiryItem}
              locale={{ emptyText: "진행중인 요청사항이 없습니다." }}
            />
          </TabPane>

          <TabPane 
            tab={
              <span>
                <CheckCircleOutlined />
                완료된 건 ({getStatusCount("completed")})
              </span>
            } 
            key="completed"
          >
            <List
              itemLayout="vertical"
              dataSource={getInquiriesByStatus("completed")}
              renderItem={renderInquiryItem}
              locale={{ emptyText: "완료된 요청사항이 없습니다." }}
            />
          </TabPane>
        </Tabs>
      </div>

      {/* 상세보기 모달 */}
      <Modal
        title="요청사항 상세보기"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            닫기
          </Button>,
          selectedInquiry?.status === "new" && (
            <Button 
              key="start" 
              type="primary"
              onClick={() => {
                updateInquiryStatus(selectedInquiry.id, "in-progress");
                setIsModalVisible(false);
              }}
            >
              진행하기
            </Button>
          ),
          selectedInquiry?.status === "in-progress" && (
            <Button 
              key="complete" 
              type="primary"
              onClick={() => {
                updateInquiryStatus(selectedInquiry.id, "completed");
                setIsModalVisible(false);
              }}
            >
              완료하기
            </Button>
          )
        ]}
        width={800}
      >
        {selectedInquiry && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="제목">{selectedInquiry.title}</Descriptions.Item>
            <Descriptions.Item label="내용">{selectedInquiry.content}</Descriptions.Item>
            <Descriptions.Item label="요청자">{selectedInquiry.memberName}</Descriptions.Item>
            <Descriptions.Item label="이메일">{selectedInquiry.memberEmail}</Descriptions.Item>
            <Descriptions.Item label="요청일시">{selectedInquiry.createdAt}</Descriptions.Item>
            <Descriptions.Item label="우선순위">
              <Tag color={getPriorityColor(selectedInquiry.priority)}>
                {selectedInquiry.priority === 'high' ? '높음' : 
                 selectedInquiry.priority === 'medium' ? '보통' : '낮음'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="상태">
              <Badge 
                status={getStatusConfig(selectedInquiry.status).color} 
                text={getStatusConfig(selectedInquiry.status).text}
              />
            </Descriptions.Item>
            {selectedInquiry.assignedTo && (
              <Descriptions.Item label="담당자">{selectedInquiry.assignedTo}</Descriptions.Item>
            )}
            {selectedInquiry.completedAt && (
              <Descriptions.Item label="완료일시">{selectedInquiry.completedAt}</Descriptions.Item>
            )}
            {selectedInquiry.solution && (
              <Descriptions.Item label="해결방안">{selectedInquiry.solution}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Inquiries;