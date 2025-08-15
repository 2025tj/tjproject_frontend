import {api} from '@shared/utils/api'

export const subscriptionApi = {

    // 구독 생성
    createSubApi: (plan) => api.post('/subscription', {plan}),
    // 구독 상태 확인
    checkSubStatApi: () => api.get('/subscription/activate'),

    // 구독 상세 정보 조회
    fetchSubDetailsApi: () => api.get('/subscription/me'),

    // 구독 해지 예약
    cancelSubApi: () => api.patch('/subscription/cancel'),

    //구독 해지 예약 취소
    revertCancelApi: () => api.patch('/subscription/cancel/revert'),

    // 구독 즉시 해지
    unSubNowApi: () => api.delete('/subscription'),

    reqRefundApi: () => api.post('/subscription/refund-request')
}