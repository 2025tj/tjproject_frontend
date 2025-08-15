import { subscriptionApi as subApi } from "@features/subscription/api/subscriptionApi"

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
            const res = await subApi.fetchSubDetailsApi()
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

    revertCancelService: async () => {
        try {
            const res = await subApi.revertCancelApi()
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
    },

    reqRefundService: async () => {
        try {
            const res = await subApi.reqRefundApi()
            return res.data
        } catch (err) {
            throw err.response?.data || err
        }
    }
}

// 플랜 타입 상수
export const PLAN_TYPES = {
    TRIAL: 'trial',
    MONTHLY: 'monthly',
    YEARLY: 'yearly'
}

// 플랜 정보
export const PLAN_INFO = {
    [PLAN_TYPES.TRIAL]: {
        name: '무료 체험',
        price: 0,
        duration: '30일',
        description: '30일 무료 체험'
    },
    [PLAN_TYPES.MONTHLY]: {
        name: '월간 구독',
        price: 9900,
        duration: '1개월',
        description: '월간 구독 플랜'
    },
    [PLAN_TYPES.YEARLY]: {
        name: '연간 구독',
        price: 99000,
        duration: '12개월',
        description: '연간 구독 플랜 (2개월 할인)'
    }
}