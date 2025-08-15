import { api} from '@shared/utils/api'

export const adminRefundApi = {
    fetchRefundRequestsApi: () => {
        const res = api.get('/admin/refunds')
        console.log('fetchRefundRequestsApi: res',res)
        return res
    },
    approveRefundApi: (id, amount) => {
        const res = api.post(`/admin/refunds/${id}/approve?amount=${amount}`)
        return res
    }
}