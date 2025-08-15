import { postAndUnwrap, getAndUnwrap } from '@shared/utils/api';

export const passwordApi = {
  requestReset: async (email) =>
    await postAndUnwrap('/auth/password/reset-request', { email }),

  validateToken: async (token) =>
    await getAndUnwrap(`/auth/password/validate-token?token=${token}`),

  resetPassword: async ({ token, newPassword }) =>
    await postAndUnwrap('/auth/password/reset', { token, newPassword }),
};