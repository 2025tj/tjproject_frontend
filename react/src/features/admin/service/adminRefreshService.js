import { adminRefreshTokenApi as rtApi } from "../api/adminRefreshTokenApi";

export const adminRefreshTokenService = {
    fetchListService: async (params) => {
        const res = await rtApi.listApi(params)
        return res.data // [{email,key,hashPreview,ttlMillis}]
    },
    deleteOneService: async (email) => {
        const res = await rtApi.deleteOne(email) // 204면 res.data는 undefined
        return res.data
    },
    deleteByPatternService: async (pattern) => {
        const res = await rtApi.deleteByPattern(pattern) // 204 예상
        return res.data
    }

}