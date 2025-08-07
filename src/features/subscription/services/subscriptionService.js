import { subscriptionApi as subApi } from "@features/subscription/api/subscriptionApi";

export const subscriptionService = {
    createSubService: async (plan) => {
        try {
            const res = await subApi.createSubApi(plan)
            return res.data
        } catch (err) {
            throw err.response?.data || err
        }
    },

    checkSubStatService: async () => {
        try {
            const res = await subApi.checkSubStatApi()
            return res.data
        } catch (err) {
            throw err.response?.data || err
        }
    },

    fetchSubDetailsService: async () => {
        try {
            const res = await subApi.fetchSubDetails()
            return res.data
        } catch (err) {
            throw err.response?.data || err
        }
    },

    cancelSubService: async () => {
        try {
            const res = await subApi.cancelSubApi()
            return res.data
        } catch (err) {
            throw err.response?.data || err
        }
    },

    unSubNowService: async () => {
        try {
            const res = await subApi.unSubNowApi()
            return res.data
        } catch (err) {
            throw err.response?.data || err
        }
    }
}