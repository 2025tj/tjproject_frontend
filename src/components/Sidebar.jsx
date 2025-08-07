import { Menu } from 'antd';
import {
  FileTextOutlined,
  FolderOpenOutlined,
  PieChartOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const company = useSelector(state => state.company);
  const items = [
    {
      key: 'company',
      icon: <FileTextOutlined />,
      label: <Link to="/semi/company">기업 분석</Link>,
    },
    {
      key: 'social',
      icon: <FolderOpenOutlined />,
      label: '소셜 분석',
      children: [
        { key: 'mention', label: <Link to="/semi/mention">언급량 분석</Link> },
        { key: 'association', label: <Link to="/semi/association">연관어 분석</Link> },
        { key: 'reputation', label: <Link to="/semi/reputation">긍/부정 분석</Link> },
      ],
    },
    {
      key: 'compare',
      icon: <PieChartOutlined />,
      label: '비교 분석',
      children: [
        { key: 'compare-mention', label: '언급량 비교' },
        { key: 'compare-association', label: '연관어 비교' },
        { key: 'compare-reputation', label: '긍/부정 비교' },
      ],
    },
    
  ];

  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={['mention']}
      defaultOpenKeys={['social', 'compare']}
      style={{ height: '100%', borderRight: 0 }}
      items={items}
    />
  );
};

export default Sidebar;
