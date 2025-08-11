import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Button,
  Modal,
  Descriptions,
  Space,
  Row,
  Col,
  Avatar,
  Spin,
  message,
} from "antd";
import {
  EyeOutlined,
  UserOutlined,
  CalendarOutlined,
  MessageOutlined,
  MailOutlined,
  ReloadOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./Inquiries.css";
import { ButtonGroup, Dropdown, ToggleButton } from "react-bootstrap";

const Base_URL = "http://localhost:8000/api";

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState("latest");    // 요청사항 정렬
  const [cardsGrid, setCardsGrid] = useState(2);  //문의 카드 수 단순

  // 문의사항 데이터 가져오기
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Base_URL}/inquiry`);
      console.log("조회 데이터", response.data);
      const inquiriesData = response.data.inquiries;
      // API 응답 데이터 구조에 맞게 조정 (필요시 수정)
      const inquiryDatas = inquiriesData.map((item) => ({
        // id: item.id,

        memberName: item.user_name,
        title: item.inquiry_title,
        content: item.inquiry_content,
        memberEmail: item.member_email,
        createdAt: item.created_at,
      }));

      setInquiries(inquiryDatas);
      message.success("문의사항을 성공적으로 불러왔습니다.");
    } catch (error) {
      console.error("문의사항 조회 오류:", error);
      message.error("문의사항을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 특정 문의사항 상세 정보 가져오기 (필요시)   방식별?   --모달로 조정될듯
  const fetchInquiryDetail = async (type) => {
    try {
      const response = await axios.get(`${Base_URL}/inquiries/${type}/`);
      return response.data;
    } catch (error) {
      console.error("문의사항 상세 조회 오류:", error);
      message.error("문의사항 상세 정보를 불러오는데 실패했습니다.");
      return null;
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchInquiries();
  }, []);

  // 요청사항 상세보기
  const showInquiryDetail = async (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalVisible(true);
  };

  // 새로고침 기능
  const handleRefresh = () => {
    fetchInquiries();
  };
  //순서 정렬 state  최신순, 오래된순 정렬위한 시간 비교
  const sortedInquiries = useMemo(() => {
    return [...inquiries].sort((a, b) => {
      const afterT = new Date(a.createdAt).getTime();
      const beforeT = new Date(b.createdAt).getTime();
      return sort === "latest" ? beforeT - afterT : afterT - beforeT;
    });
  }, [sort, inquiries]);
  // 날짜 형식 변환 함수
  // const formatDate = (dateString) => {
  //   try {
  //     const date = new Date(dateString);
  //     return date.toLocaleDateString("ko-KR", {
  //       // timeZone: "Asia/Seoul",
  //       year: "numeric",
  //       month: "2-digit",
  //       day: "2-digit",
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     }).formatDate(date);
  //   } catch (error) {
  //     return dateString;
  //   }
  // };

  const GridSpan = () => {
    switch (cardsGrid) {
      case 2:
        return 12;
      case 3:
        return 8;
      case 4:
        return 6;
      default:
        return 12;
    }
  };
  // 문의 카드 렌더링
  const renderInquiryCard = (inquiry) => {
    // const colSpan = cardsGrid === 2 ? 12 : cardsGrid === 3 ? 8 : cardsGrid === 4 ? 6 : 12;

    return (
      <Col xs={24} sm={12} md={8} lg={GridSpan()} key={inquiry.id}>
        <Card
          hoverable
          className="inquiry-card"
          actions={[
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showInquiryDetail(inquiry)}
            >
              상세보기
            </Button>,
          ]}
        >
          <div className="inquiry-card-header">
            {/* 회원 요청 카드 하나  */}
            <Avatar
              size={40}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1890ff" }}
            />
            <div className="inquiry-info">
              <h4 className="inquiry-title">{inquiry.title}</h4>
              <p className="inquiry-member">{inquiry.memberName}</p>
            </div>
          </div>

          <div className="inquiry-content">
            <p>
              {inquiry.content && inquiry.content.length > 80
                ? `${inquiry.content.substring(0, 80)}...`
                : inquiry.content}
            </p>
          </div>

          <div className="inquiry-meta">
            <Space direction="vertical" size="small">
              <div className="inquiry-email">
                <MailOutlined /> {inquiry.memberEmail}
              </div>
              <div className="inquiry-date">
                {/* 분까지 시간조정 보이기 */}
                <CalendarOutlined />{" "}
                {inquiry.createdAt.slice(0, 16).replace("T", " ")}
              </div>
            </Space>
          </div>
        </Card>
      </Col>
    );
  };

  if (loading) {
    return (
      <div className="inquiries-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '20px' }}>문의사항을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inquiries-container">
      <div className="inquiries-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2>
              <MessageOutlined /> 회원 문의 요청
            </h2>
            <p>
              총 <strong>{inquiries.length}</strong>건의 문의요청이 있습니다.
            </p>
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            새로고침
          </Button>
        </div>
        {/* <ToggleButton
          type="checkbox"
          variant={sort === "latest"?"primary": "outline-primary"}
          checked={sort === "latest"}
          value="sort"
          onChange={() =>
            setSort((prev) => (prev === "latest" ? "oldest" : "latest"))
          }
        >
          {sort === "latest" ? "최신순" : "오래된순"}
        </ToggleButton> */}
        <Button
          type={sort === "latest"?"primary": "default"}
          // ant hover 색상변경대매 추가함
          style={sort === "latest" ? { backgroundColor: "#1677ff", borderColor: "#1677ff" } : {}}
          // icon={<SwapOutlined/>}
          onClick={() =>
            setSort((prev) => (prev === "latest" ? "oldest" : "latest"))
          }
        >
          {sort === "latest" ? "최신순" : "오래된순"}
                </Button>
      </div>

      <Space style={{ marginTop: "12px" }}>
        {/* 카드 수 토글 */}

        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="secondary" id="dropdown-card-count">
            문의사항 수 {cardsGrid}개씩
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setCardsGrid(2)}>
              2개씩 보기
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setCardsGrid(3)}>
              3개씩 보기
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setCardsGrid(4)}>
              4개씩 보기
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Space>

      {/* 문의요청 카드 목록 */}
      <div className="inquiries-grid">
        {inquiries.length > 0 ? (
          <Row gutter={[16, 16]}>
            {sortedInquiries.map((inquiry) => renderInquiryCard(inquiry))}
          </Row>
        ) : (
          <div style={{ textAlign: "center", padding: "50px", color: "#999" }}>
            <MessageOutlined
              style={{ fontSize: "48px", marginBottom: "16px" }}
            />
            <p>등록된 문의사항이 없습니다.</p>
          </div>
        )}
        <br />
      </div>

      {/* 상세보기 모달 */}
      <Modal
        title={
          <Space>
            <MessageOutlined />
            문의요청 상세보기
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            닫기
          </Button>,
        ]}
        width={800}
      >
        {selectedInquiry && (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="제목" labelStyle={{ width: "120px" }}>
              {selectedInquiry.title}
            </Descriptions.Item>
            <Descriptions.Item label="문의 내용">
              <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                {selectedInquiry.content}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="요청자">
              <Space>
                <UserOutlined />
                {selectedInquiry.memberName}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="이메일">
              <Space>
                <MailOutlined />
                {selectedInquiry.memberEmail}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="요청일시">
              <Space>
                <CalendarOutlined />
                {/* {formatDate(selectedInquiry.createdAt)} */}
                {selectedInquiry.createdAt.slice(0, 16).replace("T", " ")}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Inquiries;
