import { paymentApi as payApi} from '@features/subscription/api/paymentApi'

export const paymentService = {
    refundService: async (amount) => {
        try {
            const res = await payApi.refundApi(amount)
            return res.data
        } catch (err) {
            throw err.response?.data || err
        }
    }
}