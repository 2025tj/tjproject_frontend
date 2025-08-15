import {api} from '@shared/utils/api'

export const paymentApi = {
    // 환불
    refundApi: (amount) => {
        const params = {}
        if (amount) params.amount = amount
        return api.delete('/payment', { params})
    }
}