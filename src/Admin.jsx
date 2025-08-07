import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdSide from "./AdSide";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import managerImg from "./images/image.png"; // 실제 이미지 경로로 수정
import "./ASide/AdminLoad.css";
const { Sider, Content } = Layout;

const Admin = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 오직 /Admin 경로에서만 로딩
    if (location.pathname === "/Admin") {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  if (loading && location.pathname === "/Admin") {
    return (
      <div className="admin-loading">
         <img src={managerImg} alt="관리감독자" />
        <p>관리자 모드로 전환 중...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <h3 style={{textAlign:"center", fontFamily:"'Noto Sans KR', sans-serif", margin: "20px 0"}}>
        관리자 전용 페이지 입니다.
      </h3>
      <Layout style={{ minHeight: "calc(100vh - 80px)" }}>
        <Sider width={250} style={{ background: "#fff" }}>
          <AdSide/>
        </Sider>
        <Content style={{ padding: "20px", background: "#f5f5f5" }}>
          <Outlet/>
        </Content>
      </Layout>
    </div>
  );
};

export default Admin;
