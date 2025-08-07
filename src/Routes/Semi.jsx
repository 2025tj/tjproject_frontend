import { Layout } from "antd";
import Sidebar from "../Routes/Sidebar";
import { Outlet } from "react-router-dom";

const { Sider, Content } = Layout;

//기업 상세 페이지
const Semi = () => {
  return (
    <Layout>
      <Sider width={180} style={{ background: "#ff"}}>
        <Sidebar />
      </Sider>
      <Layout>
        <Content style={{ padding: 24, background:'#e3e3eeff'}}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Semi;
