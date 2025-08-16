import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Input, Select, Button, Tooltip, Avatar } from 'antd';
import { SearchOutlined, UserOutlined, CrownOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './Members.css';

const { Search } = Input;
const { Option } = Select;

const Members = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // 샘플 데이터 (실제로는 API에서 가져올 데이터)
    const sampleMembers = [
        {
            id: 1,
            name: '김철수',
            email: 'kim@example.com',
            company: '삼성전자',
            isSubscriber: true,
            lastActivity: '2024-01-15 14:30',
            activityType: '로그인',
            status: 'active'
        },
        {
            id: 2,
            name: '이영희',
            email: 'lee@example.com',
            company: 'LG전자',
            isSubscriber: false,
            lastActivity: '2024-01-14 09:15',
            activityType: '리뷰 작성',
            status: 'active'
        },
        {
            id: 3,
            name: '박민수',
            email: 'park@example.com',
            company: '현대자동차',
            isSubscriber: true,
            lastActivity: '2024-01-13 16:45',
            activityType: '검색',
            status: 'inactive'
        },
        {
            id: 4,
            name: '최지영',
            email: 'choi@example.com',
            company: 'SK하이닉스',
            isSubscriber: false,
            lastActivity: '2024-01-12 11:20',
            activityType: '페이지 방문',
            status: 'active'
        },
        {
            id: 5,
            name: '정현우',
            email: 'jung@example.com',
            company: '포스코',
            isSubscriber: true,
            lastActivity: '2024-01-15 10:30',
            activityType: '데이터 다운로드',
            status: 'active'
        }
    ];

    useEffect(() => {
        setMembers(sampleMembers);
    }, []);

    const columns = [
        {
            title: '회원 정보',
            key: 'member',
            render: (_, record) => (
                <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{record.name}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
                        <div style={{ fontSize: '12px', color: '#999' }}>{record.company}</div>
                    </div>
                </Space>
            ),
        },
        // {
        //     title: '구독 상태',
        //     key: 'subscription',
        //     render: (_, record) => (
        //         <Space>
        //             {record.isSubscriber ? (
        //                 <Tag color="gold" icon={<CrownOutlined />}>
        //                     구독자
        //                 </Tag>
        //             ) : (
        //                 <Tag color="default">일반회원</Tag>
        //             )}
        //         </Space>
        //     ),
        // },
        {
            title: '최근 활동',
            key: 'activity',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        <ClockCircleOutlined style={{ marginRight: '4px' }} />
                        {record.lastActivity}
                    </div>
                    <div style={{ fontSize: '11px', color: '#999' }}>
                        {record.activityType}
                    </div>
                </Space>
            ),
        },
        {
            title: '상태',
            key: 'status',
            render: (_, record) => (
                <Tag color={record.status === 'active' ? 'green' : 'red'}>
                    {record.status === 'active' ? '활성' : '비활성'}
                </Tag>
            ),
        },
        {
            title: '액션',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button size="small" type="link">
                        상세보기
                    </Button>
                    <Button size="small" type="link">
                        활동로그
                    </Button>
                </Space>
            ),
        },
    ];

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchText.toLowerCase()) ||
                            member.email.toLowerCase().includes(searchText.toLowerCase()) ||
                            member.company.toLowerCase().includes(searchText.toLowerCase());
        
        // const matchesFilter = filterStatus === 'all' || 
        //                     (filterStatus === 'subscriber' && member.isSubscriber) ||
        //                     (filterStatus === 'nonsubscriber' && !member.isSubscriber);
        
        // return matchesSearch && matchesFilter;
        return matchesSearch 
    });

    return (
        <div className="members-container">
            <div className="members-header">
                <h2>회원 목록</h2>
                <div className="members-stats">
                    <span>총 회원: {members.length}명</span>
                    {/* <span>구독자: {members.filter(m => m.isSubscriber).length}명</span> */}
                </div>
            </div>

            <div className="members-filters">
                <Space>
                    <Search
                        placeholder="회원명, 이메일, 회사명으로 검색"
                        allowClear
                        style={{ width: 300 }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Select
                        defaultValue="all"
                        style={{ width: 120 }}
                        onChange={setFilterStatus}
                    >
                        <Option value="all">전체</Option>
                        {/* <Option value="subscriber">구독자</Option> */}
                        <Option value="nonsubscriber">일반회원</Option>
                    </Select>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={filteredMembers}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}개 항목`,
                }}
                className="members-table"
            />
        </div>
    );
};

export default Members;