import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cancelSubThunk, createRefundRequestThunk, fetchSubDetailsThunk, refundThunk, revertCancelThunk, unSubNowThunk } from '../store/subscriptionThunk'
import { clearError, clearSuccessMessage } from '../store/subscriptionSlice'
import { useNavigate } from 'react-router'

const SubscriptionManagement = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [refundAmount, setRefundAmount] = useState()

    // redux에서 직접 가져오는 state
    const {
        subscriptionDetails,
        isActive,
        detailsLoading,
        loading,
        error,
        successMessage
    } = useSelector(state => state.subscription)

    const [showCancelConfirm, setShowCancelConfirm] = useState(false)
    const [showUnsubConfirm, setShowUnsubConfirm] = useState(false)
    const [showRevertConfirm, setShowRevertConfirm] = useState(false)

    // 컴포넌트 마운트시에만 구독 상세 정보 조회
    useEffect(() => {
        if (isActive && !subscriptionDetails && !detailsLoading) {
            dispatch(fetchSubDetailsThunk())
        }
    }, [dispatch, isActive, subscriptionDetails, detailsLoading])

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                dispatch(clearSuccessMessage())
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [successMessage, dispatch])

    const handleCancel = () => {
        dispatch(cancelSubThunk())
        setShowCancelConfirm(false)
        //상세정보 다시 조회
        dispatch(fetchSubDetailsThunk())
    }

    const handleRevertCancel = () => {
        //dispatch(subscriptionSlice.actions.setStatusActive())
        dispatch(revertCancelThunk())
            .unwrap()
            .then(() => {
                setShowRevertConfirm(false)
                dispatch(fetchSubDetailsThunk())
            })
            .catch(()=>{
                setShowRevertConfirm(false)
            })
    }

    const handleUnsubscribe = () => {
        dispatch(unSubNowThunk())
        setShowUnsubConfirm(false)
    }

    const handleRefund = () => {
        // dispatch(refundThunk(refundAmount))
        // dispatch(refundThunk({amount: refundAmount || null}))
        dispatch(createRefundRequestThunk())
        setShowUnsubConfirm(false)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(price)
    }

    if (detailsLoading) {
        return (
            <div>구독 정보를 불러오는 중...</div>
        )
    }

    // console.log('isActive:', isActive)
    // console.log('subscriptionDetails:', subscriptionDetails)

    if (!isActive || !subscriptionDetails) {
        return (
            <div>
                <p>현재 활성화된 구독이 없습니다.</p>
            <button
                onClick={() => navigate('/subscription')}
            >
                구독하기
            </button>
            </div>
        )
    }

    return (
        <div>
            <h2>구독 관리</h2>

            {/* 성공/에러 메세지 */}
            {successMessage && (
                <div>{successMessage}</div>
            )}

            {error && (
                <div>
                    <span>{error}</span>
                    <button
                        onClick={() => dispatch(clearError())}
                    >
                        x
                    </button>
                </div>
            )}

            {/*구독 정보*/}
            <div>
                <h3>현재 구독</h3>
                <div>
                    <label>
                        플랜
                    </label>
                    <p>
                        {subscriptionDetails.plan?.name === 'trial' && '무료 체험'}
                        {subscriptionDetails.plan?.name === 'monthly' && '월간 구독'}
                        {subscriptionDetails.plan?.name === 'yearly' && '연간 구독'}
                    </p>
                </div>
                <div>
                    <label>
                        가격
                    </label>
                    <p>
                        {formatPrice(subscriptionDetails.plan?.price || 0)}
                    </p>
                </div>
                <div>
                    <label>
                        시작일
                    </label>
                    <p>
                        {formatDate(subscriptionDetails.startDate)}
                    </p>
                </div>
                <div>
                    <label>
                        만료일
                    </label>
                    <p>
                        {formatDate(subscriptionDetails.endDate)}
                    </p>
                </div>
            </div>
            <div>
                <label>
                    상태
                </label>
                <div>
                    <span className={`${
                        subscriptionDetails.status === 'ACTIVE' ? 'bg-green-100 text-green-800'
                        : subscriptionDetails.status === 'CANCELLED' ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {subscriptionDetails.status === 'ACTIVE' && '활성'}
                        {subscriptionDetails.status === 'CANCELLED' && '해지 예약됨'}
                        {subscriptionDetails.status === 'EXPIRED' && '만료됨'}
                    </span>
                    {subscriptionDetails.status === 'CANCELLED' && (
                        <button onClick={()=> setShowRevertConfirm(true)}>
                            해지 예약 취소
                        </button>
                    )}
                </div>
                
            </div>

            {/* 구독 관리 버튼 */}
            <div>
                <button
                    onClick={() => setShowCancelConfirm(true)}
                    disabled={loading}
                >
                    {loading ? '처리중...' : '구독 해지 예약 (만료일까지 사용 가능)'}
                </button>
                <button
                    onClick={() => setShowUnsubConfirm(true)}
                    disabled={loading}
                >
                    {loading ? '처리중...' : '즉시 해지 (환불 불가)'}
                </button>
            </div>

            {/* 해지 예약 확인 모달 */}
            {showCancelConfirm && (
                <div>
                    <h3>구독 해지 예약</h3>
                    <p>
                        구독 해지를 예약하시겠습니까? 현재 구독 기간이 만료될 때까지는 계속 사용하실 수 있습니다.
                    </p>
                    <div>
                        <button
                            onClick={() => setShowCancelConfirm(false)}
                        >
                            취소
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}

            {/*해지 예약 취소 확인 모달 */}
            {showRevertConfirm && (
                <div>
                    <h3>해지 예약 취소</h3>
                    <p>해지 예약을 취소하시겠습니까? 구독은 계속 유지됩니다.</p>
                    <div>
                        <button onClick={()=>setShowRevertConfirm(false)}>취소</button>
                        <button onClick={handleRevertCancel} disabled={loading}>
                            확인
                        </button>
                    </div>
                </div>
            )}

            {/*즉시 해지 확인 모달*/}
            {showUnsubConfirm && (
                <div>
                    <h3>즉시 해지</h3>
                    {/* <p>
                        구독을 즉시 해지하시겠습니까? 이 작업은 되돌릴 수 없으며, 남은 구독 기간에 대한 환불은 불가능합니다.
                    </p> */}
                    {/* <p>
                        구독을 즉시 해지하시겠습니까?
                        {` 남은 기간에 대한 환불${refundAmount ? ` (${refundAmount}원)` : ''}이 진행됩니다.`}
                    </p>
                    <input
                        type='number'
                        placeholder='부분 환불 금액(선택)'
                        value={refundAmount || 0}
                        onChange={(e) => setRefundAmount(e.target.value)}
                    /> */}
                    <p>
                        구독을 즉시 해지하시겠습니까?
                        환불은 관리자가 확인 후 처리됩니다.
                    </p>
                    <div>
                        <button
                            onClick={() => setShowUnsubConfirm(false)}
                        >
                            취소
                        </button>
                        <button
                            onClick={handleRefund}
                            disabled={loading}
                        >
                            즉시 해지
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
export default SubscriptionManagement