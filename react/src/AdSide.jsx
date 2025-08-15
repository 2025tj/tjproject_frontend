import React from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, MessageOutlined, TeamOutlined, DollarOutlined, SaveTwoTone, RedoOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

const AdSide = () => {
  const location = useLocation();

  const items = [
    { 
      key: "admin-info",
      icon: <UserOutlined />,
      label: <Link to="/mypage">관리자 정보</Link>,
      // label: <Link to="/admin">관리자 정보</Link>,
    },
    {
      key: "inquiries",
      icon: <MessageOutlined />,
      label: <Link to="/admin/inquiries">문의요청사항</Link>,
    },
    {
      key: "member-management",
      icon: <TeamOutlined />,
      label: <Link to="/admin/members">회원관리</Link>,
    },
    { 
      key: "user-info",
      icon: <UserOutlined />,
      label: <Link to="/admin/users">회원 정보</Link>,
    },
    {
      key: "refunds",
      icon: <DollarOutlined />,
      label: <Link to="/admin/refunds">환불관리</Link>,
    },
    {
      key: "refresh-tokens",
      icon: <RedoOutlined />,
      label: <Link to="/admin/refresh-tokens">refresh-tokens관리</Link>,
    },
  ];

  // 현재 경로에 따라 선택된 키 결정
  const getSelectedKey = () => {
    if (location.pathname.includes('/inquiries')) return 'inquiries';
    if (location.pathname.includes('/members')) return 'member-management';
    // return 'admin-info';
  };

  return (
    <Sider width={250} style={{ background: "#fff" }}>
      <div style={{ padding: "20px 0", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
        <h3 style={{ margin: 0, color: "#1890ff" }}>관리자 메뉴</h3>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        style={{ height: "calc(100% - 80px)", borderRight: 0 }}
        items={items}
      />
    </Sider>
  );
};

export default AdSide;
