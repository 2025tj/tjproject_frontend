import React from 'react'
import api from '@/api/client'
import { useNavigate } from 'react-router-dom'

const PaymentTestButton = ({ planType, amount }) => {
    const navigate = useNavigate()

    const generateMerchantUid = () => {
        return `order_${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`
    }

    const handlePay = () => {
        const IMP = window.IMP
        IMP.init('impXXXXXXXXX')

        const merchantUid = generateMerchantUid()

        IMP.request_pay(
            {
                pg: 'html5_inicis',
                pay_method: 'card',
                merchant_uid: merchantUid,
                name: `${planType.toUpperCase()} 구독 결제`,
                amount: amount,
                buyer_email: 'chlorella71@naver.com',
                buyer_name: 'chlorella71',
            },
            async (rsp) => {
                if (rsp.success) {
                    console.log('아임포트 결제 성공: ', rsp)
                    // 서버에 결제 완료 알림
                    const res = await api.post('/api/payments/complete', {
                        impUid: rsp.imp_uid,
                        merchantUid: rsp.merchant_uid,
                        amount: rsp.paid_amount,
                        planType: planType.toUpperCase(),
                    })

                    console.log('서버 결제 처리 결과: ', res.data)
                    alert('결제가 완료되었습니다.')
                    navigate('/subscription/manage')
                } else {
                    console.error('결제 실패: ', rsp.error_msg)
                    alert('결제 실패: ' + rsp.error_msg)
                }
            }
        )
    }

    return (
        <button
            onClick={handlePay}
            className='bg-blue-500 text-white px-4 py-2 rounded'
        >
            {planType.toUpperCase()} 결제 테스트
        </button>
    )
}

export default PaymentTestButton