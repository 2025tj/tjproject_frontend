import { oauth2Api } from '../../oauth2/api/oauth2Api'
import { userApi } from '../api/userApi'
import { ApiError } from '@shared/errors/ApiError'

export const userService = {
  getCurrentUserEmail: async () => {
    try {
      return await userApi.getCurrentUserEmail()
    } catch (err) {
      throw new ApiError(err?.response?.data || err)
    }
  },

  getProfile: async () => {
    try {
      return await userApi.getProfile()
    } catch (err) {
      throw new ApiError(err?.response?.data || err)
    }
  },

  updateUserInfo: async (updateData) => {
    try {
      return await userApi.updateUserInfo(updateData)
    } catch (err) {
      throw new ApiError(err?.response?.data || err)
    }
  },

//   linkSocial: async (linkData) => {
//     try {
//       return await userApi.linkSocial(linkData)
//     } catch (err) {
//       throw new ApiError(err?.response?.data || err)
//     }
//   },

  linkSocial: async (data) => {
    try {
      return await oauth2Api.linkSocial(data)
    } catch (err) {
      throw new ApiError(err?.response?.data || err)
    }
  },
  unlinkSocial: async (provider) => {
    try {
      return await oauth2Api.unlinkSocial(provider)
    } catch (err) {
      throw new ApiError(err?.response?.data || err)
    }
  },
  getLinkedProviders: async () => {
    console.log('getLinkedProviders진입')
    try {
      const res = await oauth2Api.getLinkedProviders()
      console.log('res :', res)
      return res
    } catch (err) {
      throw new ApiError(err?.response?.data || err)
    }
  },

  getPendingSocialLink: async () => {
    try {
      return await userApi.getPendingSocialLink()
    } catch (err) {
      throw new ApiError(err?.response?.data || err)
    }
  },

  withdrawService: async (data) => {
    const res = await userApi.withdrawApi(data)
    if (!res?.success) {
      const msg = res?.message || '탈퇴 처리에 실패했습니다.'
      throw new Error(msg)
    }
    return { message : res.message || '탈퇴 처리되었습니다. 14일 후 영구 삭제됩니다.'}
  }
}