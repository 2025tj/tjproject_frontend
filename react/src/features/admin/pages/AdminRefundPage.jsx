import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRefundRequestsThunk, approveRefundThunk } from '../store/adminRefundThunk'
import '../css/AdminRefundPage.css'

const AdminRefundPage = () => {
    const dispatch = useDispatch()
    const { list, loading, error, successMessage } = useSelector(state => state.adminRefunds)

    const [selectedId, setSelectedId] = useState(null)
    const [amount, setAmount] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        dispatch(fetchRefundRequestsThunk())
    }, [dispatch])

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                dispatch({ type: 'adminRefunds/clearAdminRefundState' })
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [successMessage, dispatch])

    const handleApprove = (id) => {
        setSelectedId(id)
        setIsModalOpen(true)
    }

    const submitApproval = async () => {
        try {
            await dispatch(approveRefundThunk({ 
                id: selectedId, 
                amount: parseInt(amount, 10) || 0 
            })).unwrap()
            await dispatch(fetchRefundRequestsThunk()).unwrap()
            setSelectedId(null)
            setAmount('')
            setIsModalOpen(false)
        } catch (error) {
            console.error('환불 승인 실패:', error)
        }
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            'REQUESTED': { className: 'status-badge status-requested', label: '요청됨' },
            'APPROVED': { className: 'status-badge status-approved', label: '승인됨' },
            'REJECTED': { className: 'status-badge status-rejected', label: '거절됨' }
        }
        const config = statusConfig[status] || statusConfig['REQUESTED']
        return (
            <span className={config.className}>
                {config.label}
            </span>
        )
    }

    const formatDate = (dateString) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatPrice = (price) => {
        if (!price) return '-'
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(price)
    }

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>환불 요청을 불러오는 중...</p>
            </div>
        )
    }

    return (
        <div className="admin-refund-page">
            <div className="refund-page-container">
                {/* 헤더 */}
                <div className="page-header">
                    <h1 className="page-title">환불 요청 관리</h1>
                    <p className="page-subtitle">사용자의 환불 요청을 검토하고 승인합니다.</p>
                </div>

                {/* 성공/에러 메시지 */}
                {successMessage && (
                    <div className="success-message">
                        <span className="success-text">{successMessage}</span>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        <span className="error-text">에러: {error}</span>
                    </div>
                )}

                {/* 환불 요청 테이블 */}
                <div className="refund-table-container">
                    <div className="table-wrapper">
                        <table className="refund-table">
                            <thead className="table-header">
                                <tr>
                                    <th>요청 ID</th>
                                    <th>사용자 이메일</th>
                                    <th>구독 플랜</th>
                                    <th>구독 가격</th>
                                    <th>승인된 환불 금액</th>
                                    <th>요청일</th>
                                    <th>처리일</th>
                                    <th>상태</th>
                                    <th>작업</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {list?.map(req => (
                                    <tr key={req.id} className="table-row">
                                        <td className="refund-id">{req.id}</td>
                                        <td className="refund-email">{req.email}</td>                    
                                        <td className="refund-plan">{req.plantype}</td>                 
                                        <td className="refund-price">{formatPrice(req.originalPrice)}</td> 
                                        <td className="refund-amount">
                                            {req.approvedAmount ? formatPrice(req.approvedAmount) : '-'}
                                        </td>
                                        <td className="refund-date">{formatDate(req.requestedAt)}</td>
                                        <td className="refund-processed-date">
                                            {req.processedAt ? formatDate(req.processedAt) : '-'}
                                        </td>
                                        <td className="refund-status">{getStatusBadge(req.status)}</td>
                                        <td className="refund-actions">
                                            {req.status === 'REQUESTED' ? (
                                                <button
                                                    onClick={() => handleApprove(req.id)}
                                                    className="approve-btn"
                                                >
                                                    승인
                                                </button>
                                            ) : (
                                                <span className="text-muted">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {(!list || list.length === 0) && (
                        <div className="empty-state">
                            <p>환불 요청이 없습니다.</p>
                        </div>
                    )}
                </div>

                {/* 환불 승인 모달 */}
                {isModalOpen && (
                    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3 className="modal-title">환불 승인</h3>
                            <p className="modal-description">
                                승인할 환불 금액을 입력하세요:
                            </p>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="환불 금액"
                                className="modal-input"
                            />
                            <div className="modal-buttons">
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        setSelectedId(null)
                                        setAmount('')
                                    }}
                                    className="modal-btn modal-btn-cancel"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={submitApproval}
                                    className="modal-btn modal-btn-confirm"
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminRefundPage