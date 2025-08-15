import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { fetchRefundRequestsThunk, approveRefundThunk} from '../store/adminRefundThunk'

const AdminRefundPage = () => {
    const dispatch = useDispatch()
    const { list, loading, error, successMessage } = useSelector(state => state.adminRefunds)

    const [selectedId, setSelectedId] = useState(null)
    const [ amount, setAmount] = useState('')

    useEffect(() => {
        dispatch(fetchRefundRequestsThunk()).then((res) => {
            console.log('환불 요청 응답: ', res)
        })
    }, [dispatch])

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(()=>{
                dispatch({type: 'adminRefunds/clearAdminRefundState'}, 3000)
            })
            return () => clearTimeout(timer)
        }
    },[successMessage, dispatch])

    const handleApprove = (email) => {
        setSelectedId(email)
    }

    const submitApproval = async () => {
        await dispatch(approveRefundThunk({id:selectedId, amount: parseInt(amount, 10) || 0})).unwrap()
        await dispatch(fetchRefundRequestsThunk()).unwrap()
        setSelectedId(null)
        setAmount('')
    }

    if (loading) return <div>로딩중...</div>
    if (error) return <div style={{color: 'red'}}>에러: {error}</div>

    return (
        <div style={{padding: 20}}>
            <h2>환불 요청 관리</h2>
            {successMessage && <div style={{color: 'green'}}>{successMessage}</div>}

            <table border="1" cellPadding={8} style={{width: '100%', marginTop: 20}}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>이메일</th>
                        <th>플랜</th>
                        <th>플랜 가격</th>
                        <th>환불 금액</th>
                        <th>요청일</th>
                        <th>상태</th>
                        <th>승인</th>
                    </tr>
                </thead>
                <tbody>
                    {list?.map(req => (
                        <tr key={req.id}>
                            <td>{req.id}</td>
                            <td>{req.email}</td>
                            <td>{req.plantype}</td>
                            <td>{req.originalPrice}</td>
                            <td>{req.approvedAmount ?? '-'}</td>
                            <td>{req.requestedAt}</td>
                            <td>{req.status}</td>
                            <td>
                                {req.status === 'REQUESTED' ? (
                                    <button onClick={() => handleApprove(req.id)}>승인</button>
                                ) : (
                                    '-'
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedId && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ background: '#fff', padding: 20, borderRadius: 8}}>
                        <h3>환불 승인</h3>
                        <p>환불 금액을 입력하세요:</p>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="환불 금액" />
                        <div style={{marginTop: 10}}>
                            <button onClick={() => setSelectedId(null)}>취소</button>
                            <button onClick={submitApproval} style={{marginLeft: 10}}>
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default AdminRefundPage