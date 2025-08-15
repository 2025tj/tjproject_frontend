import { passwordApi } from '../api/passwordApi';
import { ApiError } from '@shared/errors/ApiError';

export const passwordService = {
  requestReset: async (email) => {
    try {
      return await passwordApi.requestReset(email);
    } catch (err) {
      throw new ApiError(err?.response?.data || err);
    }
  },
  validateToken: async (token) => {
    try {
      return await passwordApi.validateToken(token);
    } catch (err) {
      throw new ApiError(err?.response?.data || err);
    }
  },
  resetPassword: async ({ token, newPassword }) => {
    try {
      return await passwordApi.resetPassword({ token, newPassword });
    } catch (err) {
      throw new ApiError(err?.response?.data || err);
    }
  },
};