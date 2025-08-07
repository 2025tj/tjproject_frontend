import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  FileTextOutlined,
  FolderOpenOutlined,
  PieChartOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    {
      key: '/semi/company', //company?
      icon: <FileTextOutlined />,
      label: '기업 관련',
      children: [
        {
          key: '/semi/company',
          label: '기업 정보',
        },
        {
          key: '/semi/companyreview',
          label: '기업 리뷰 분석',
        },
      ],
    },
    {
      key: 'social',
      icon: <FolderOpenOutlined />,
      label: '소셜 분석',
      children: [
        {
          key: '/semi/mention',
          label: '언급량 분석',
        },
        {
          key: '/semi/association',
          label: '연관어 분석',
        },
        {
          key: '/semi/reputation',
          label: '긍/부정 분석',
        },
      ],
    },
    {
      key: 'compare',
      icon: <PieChartOutlined />,
      label: '비교 분석',
      children: [
        {
          key: '/semi/compare/mention',
          label: '언급량 비교',
        },
        {
          key: '/semi/comparekeyword',
          label: '연관어 비교',
        },
        {
          key: '/semi/compare/reputation',
          label: '긍/부정 비교',
        },
      ],
    },
  ];

  return (
    <Sider className="site-layout-background" width={180}>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={['social', 'compare']}
        style={{ height: '100vh', borderRight: 0 }}
        items={items}
        onClick={({ key }) => {
          const params = new URLSearchParams(location.search); // 기존 쿼리 유지
          navigate(`${key}?${params.toString()}`);
        }}
      />
    </Sider>
  );
};

export default Sidebar;
