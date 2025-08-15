import { getAndUnwrap, postAndUnwrap } from '@shared/utils/api'
import { api } from '../../../shared/utils/api';

export const emailApi = {
  /**
   * 이메일 인증 토큰 검증 (링크 클릭 시 사용)
   * GET /api/email/verify?token=...
   * @param {string} token - 이메일 인증 토큰
   * @returns {Promise<string>} 인증 성공/실패 메시지
   */
  verifyEmailToken: async (token) => {
  try {
    const res = await api.get(`/email/verify?token=${encodeURIComponent(token)}`);
    return res.data; // ✅ 이 경우, res.data는 서버에서 전달한 메시지 문자열
  } catch (err) {
    const res = err.response;
    if (res?.data) {
      throw new Error(res.data); // "인증에 실패했습니다: ..." 메시지
    }
    throw err;
  }
},

  /**
   * 인증 메일 재발송
   * POST /api/email/resend-verification
   * @returns {Promise<string>} 성공/실패 메시지
   */
  resendVerificationEmail: async () => {
    try {
      const res = await api.post('/email/resend-verification');
      return res.data; // "인증 메일이 재발송되었습니다. 이메일을 확인해주세요."
    } catch (err) {
      const res = err.response;
      if (res?.data) {
        throw new Error(res.data); // "재발송에 실패했습니다: ..." 메시지
      }
      throw err;
    }
  }
}