import {adminRefundApi as refund} from '../api/adminRefundApi'

export const adminRefundService = {
    fetchRefundRequestsService: async () => {
        const res = await refund.fetchRefundRequestsApi()
        console.log('fetchRefundRequestsService:res', res)
        return res.data
    },
    approveRefundService: async (id, amount) => {
        const res = await refund.approveRefundApi(id, amount)
        return res.data
    }
}