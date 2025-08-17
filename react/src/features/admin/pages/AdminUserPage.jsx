import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminUsersThunk, changeUserStatusThunk } from '../store/adminUserThunk'
import '../css/AdminUserPage.css'

const AdminUserPage = () => {
    const dispatch = useDispatch()
    const {list, loading, error} = useSelector(state => state.adminUsers)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    // const currentUser = useSelector(state => state.user.profile)
    // console.log(currentUser)

    // // 관리자 권환 확인
    // if (!currentUser?.roles?.includes('ROLE_ADMIN')) {
    //     return <p>관리자만 접근할 수 있습니다.</p>
    // }

    useEffect(()=>{
        dispatch(fetchAdminUsersThunk())
    }, [dispatch])

    // const handleAction = (id, action) => {
    //     dispatch(changeUserStatusThunk({id, action}))
    // }
    const handleAction = (id, action) => {
        const actionText = {
            'activate': '활성화',
            'deactivate': '비활성화',
            'block': '차단'
        }[action]
        
        if (window.confirm(`정말로 이 사용자를 ${actionText}하시겠습니까?`)) {
            dispatch(changeUserStatusThunk({ id, action }))
        }
    }

    const filteredUsers = list?.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter
        return matchesSearch && matchesStatus
    }) || []

    const getStatusBadge = (status) => {
        const statusConfig = {
            'ACTIVE': { className: 'status-badge status-active', label: '활성' },
            'INACTIVE': { className: 'status-badge status-inactive', label: '비활성' },
            'BLOCKED': { className: 'status-badge status-blocked', label: '차단됨' },
            'PENDING': { className: 'status-badge status-pending', label: '대기중' }
        }
        const config = statusConfig[status] || statusConfig['INACTIVE']
        return (
            <span className={config.className}>
                {config.label}
            </span>
        )
    }

    const getRoleBadge = (roles) => {
        if (!roles || roles.length === 0) return '-'
        return roles.map(role => (
            <span key={role} className="role-badge">
                {role.replace('ROLE_', '')}
            </span>
        ))
    }

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>사용자 정보를 불러오는 중...</p>
            </div>
        )
    }

    return (
        <div className="admin-user-page">
            <div className="user-page-container">
                {/* 헤더 */}
                <div className="page-header">
                    <h1 className="page-title">사용자 관리</h1>
                    <p className="page-subtitle">시스템 사용자 계정을 관리하고 모니터링합니다.</p>
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <div className="error-message">
                        <span className="error-text">{error}</span>
                    </div>
                )}

                {/* 필터 및 검색 */}
                <div className="filter-section">
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            placeholder="이메일 또는 닉네임으로 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="status-filter"
                    >
                        <option value="all">모든 상태</option>
                        <option value="ACTIVE">활성</option>
                        <option value="INACTIVE">비활성</option>
                        <option value="BLOCKED">차단됨</option>
                        <option value="PENDING">대기중</option>
                    </select>
                </div>

                {/* 사용자 테이블 */}
                <div className="user-table-container">
                    <div className="table-wrapper">
                        <table className="user-table">
                            <thead className="table-header">
                                <tr>
                                    <th>ID</th>
                                    <th>이메일</th>
                                    <th>닉네임</th>
                                    <th>권한</th>
                                    <th>상태</th>
                                    <th>작업</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="table-row">
                                        <td className="user-id">{user.id}</td>
                                        <td className="user-email">{user.email}</td>
                                        <td className="user-nickname">{user.nickname || '-'}</td>
                                        <td className="user-roles">{getRoleBadge(user.roles)}</td>
                                        <td className="user-status">{getStatusBadge(user.status)}</td>
                                        <td className="user-actions">
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => handleAction(user.id, 'activate')}
                                                    disabled={user.status === 'ACTIVE'}
                                                    className="action-btn action-btn-activate"
                                                >
                                                    활성화
                                                </button>
                                                <button
                                                    onClick={() => handleAction(user.id, 'deactivate')}
                                                    disabled={user.status === 'INACTIVE'}
                                                    className="action-btn action-btn-deactivate"
                                                >
                                                    비활성화
                                                </button>
                                                <button
                                                    onClick={() => handleAction(user.id, 'block')}
                                                    disabled={user.status === 'BLOCKED'}
                                                    className="action-btn action-btn-block"
                                                >
                                                    차단
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {filteredUsers.length === 0 && (
                        <div className="empty-state">
                            <p>검색 결과가 없습니다.</p>
                        </div>
                    )}
                </div>

                {/* 통계 정보 */}
                <div className="user-stats">
                    총 {filteredUsers.length}명의 사용자가 있습니다.
                </div>
            </div>
        </div>
    )
}
export default AdminUserPage