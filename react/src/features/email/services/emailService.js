import { emailApi } from '../api/emailApi'
import { ApiError } from '@shared/errors/ApiError'

export const emailService = {
  resendVerification: async () => {
    try {
      return await emailApi.resendVerificationEmail()
    } catch (err) {
      throw new ApiError(err?.response?.data || err)
    }
  },

  verifyToken: async (token) => {
    try {
      return await emailApi.verifyEmailToken(token)
    } catch (err) {
      throw new ApiError(err?.response?.data || err)
    }
  },
}