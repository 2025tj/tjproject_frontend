import React, { useEffect } from 'react';
import { Table, Tag, Space, Button, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsersThunk, changeUserStatusThunk } from '../features/admin/store/adminUserThunk';

const Members = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector(state => state.adminUsers);

  useEffect(() => {
    dispatch(fetchAdminUsersThunk());
  }, [dispatch]);

  const handleAction = (id, action) => {
    dispatch(changeUserStatusThunk({ id, action }))
      .unwrap()
      .then(() => {
        message.success(`사용자 ${action} 처리 완료`);
      })
      .catch(() => {
        message.error('처리 중 오류 발생');
      });
  };

  const columns = [
    {
      title: '회원 정보',
      dataIndex: 'nickname',
      key: 'member',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.nickname}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: roles => roles?.map(role => (
        // 관리자만 빨간색
        <Tag color={role.includes('ADMIN') ? 'red' : 'blue'} key={role}>
          {role}
        </Tag>
      )),
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'active' ? 'green' : 'volcano'}>
          {/* {status === 'active' ? '활성' : '비활성'}   */}
          {status === 'active' ? '활성' : status === 'deactive' ? '비활성' : status}
        </Tag>
      ),
    },
    {
      title: '액션',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button size="small" onClick={() => handleAction(record.id, 'activate')}>활성화</Button>
          <Button size="small" onClick={() => handleAction(record.id, 'deactivate')}>비활성화</Button>
          <Button size="small" danger onClick={() => handleAction(record.id, 'block')}>차단</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 0 }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Table
        columns={columns}
        dataSource={list}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}명`,
        }}
      />
    </div>
  );
};

export default Members;
