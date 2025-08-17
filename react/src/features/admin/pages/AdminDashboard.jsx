import React from 'react'
import { Link } from 'react-router-dom'
import '../css/AdminDashboard.css'

const AdminDashboard = () => {
    const menuItems = [
        {
            path: '/admin/users',
            title: '회원 관리',
            description: '사용자 계정 상태 및 권한 관리',
            color: 'menu-item-blue'
        },
        {
            path: '/admin/refunds', 
            title: '환불 관리',
            description: '환불 요청 승인 및 처리',
            color: 'menu-item-green'
        },
        {
            path: '/admin/refresh-tokens',
            title: 'Refresh Token 관리',
            description: '사용자 세션 토큰 관리',
            color: 'menu-item-purple'
        },
        {
        path: '/admin/inquiries',  // 새로 추가
        title: '문의 관리',
        description: '사용자 문의사항 관리 및 답변',
        color: 'menu-item-orange'
    }
    ]
    
    return (
        <div className="admin-dashboard">
            <div className="dashboard-container">
                {/* 헤더 */}
                <div className="dashboard-header">
                    <h1 className="dashboard-title">관리자 대시보드</h1>
                    <p className="dashboard-subtitle">
                        시스템 전반을 관리하고 모니터링할 수 있습니다.
                    </p>
                </div>

                {/* 메뉴 그리드 */}
                <div className="menu-grid">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`menu-item ${item.color}`}
                        >
                            <div className="menu-item-content">
                                <div className="menu-text">
                                    <h3 className="menu-title">{item.title}</h3>
                                    <p className="menu-description">{item.description}</p>
                                </div>
                                <div className="menu-arrow">→</div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* 통계 카드 */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">총 사용자</p>
                                <p className="stat-value">-</p>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">활성 구독</p>
                                <p className="stat-value">-</p>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">환불 대기</p>
                                <p className="stat-value">-</p>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">시스템 상태</p>
                                <p className="stat-value stat-value-success">정상</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AdminDashboard