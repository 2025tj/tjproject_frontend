import {api, postAndUnwrap} from '@shared/utils/api'
import { clearAccessToken, saveAccessFromHeaders } from '../utils';
import { getAndUnwrap, refreshApi, unwrapApiResponse, unwrapApiResponseWithoutData } from '../../../shared/utils/api';
import { ApiError } from '@shared/errors/ApiError';

// 공통 unwrapping
const unwrap = (res) => res?.data?.data ?? res?.data

export const authApi = {
    /**
   * 회원가입
   * @param {Object} userData - 회원가입 데이터
   * @param {string} userData.email - 이메일
   * @param {string} userData.password - 비밀번호
   * @param {string} userData.confirmPassword - 비밀번호 확인
   * @param {string} userData.nickname - 닉네임
   */
  signup: async (userData) => {
    const res = await api.post('/auth/signup', userData)
    return res.data
  },

  /**
   * 로그인
   * @param {Object} credentials - 로그인 정보
   * @param {string} credentials.email - 이메일
   * @param {string} credentials.password - 비밀번호
   */
  login: async (credentials) => {
    try {
      // headers, data, status 등 모든 정보 포함
      const res = await api.post('/auth/login', credentials)
      return res
    } catch (err) {
      const res = err.response
      if (res?.data?.code) {
        throw new ApiError(res.data) // ⭐️ 중요: 여기!
      }
      throw err
    }
      
  },

  /**
   * 로그아웃
   */
  logout: async () => {
    try {
      await postAndUnwrap('/auth/logout')
    } catch (err) {
        console.warn('서버 로그아웃 실패:', err);
    } finally {
      // 토큰 제거 (API 실패해도 로컬 토큰은 제거)
      clearAccessToken()
      window.location.href = '/login';
    }
  },

  /**
   * 토큰 갱신
   */
  // refreshToken: () => postAndUnwrap('/auth/refresh'),
  refreshToken: async () => {
    try {
      const res = await refreshApi.post('/refresh')
      saveAccessFromHeaders(res.headers) // ✅ headers가 있는 원본 전체를 사용
      console.log('res.headers: ', res.headers)
      unwrapApiResponseWithoutData(res.data) // ✅ 에러 처리 목적이면 이건 실행만
      return res // ✅ headers 있는 원본을 리턴
    } catch (err) {
      const res = err.response
      if (res?.data?.code) {
        throw new ApiError(res.data)
      }
      throw err
    }
  },


  /**
   * 토큰 검증
   */
  validateToken: () => getAndUnwrap('/auth/validate'),

  /**
   * OAuth2 완료 처리
   */
  oauth2Complete: () => getAndUnwrap('/auth/oauth2/complete'),

  //탈퇴 복구
  reactivateApi: async ({email, password}) => {
    try {
      const res = await api.post('/auth/reactivate', {email, password})
      return unwrap(res) // headers 포함
    } catch (err) {
      const res = err?.response
      if(res?.data?.code) throw new ApiError(res.data)
      throw err
    }
  },

  /**
   * 비밀번호 재설정 요청
   * @param {string} email - 이메일
   */
  requestPasswordReset: async (email) => {
    try {
      const res = await api.post('/auth/password/reset-request', { email })
      return res.data // 메시지: "비밀번호 재설정 링크가 이메일로 발송되었습니다."
    } catch (err) {
      throw err.response?.data || err
    }
  },

  /**
   * 비밀번호 재설정 토큰 검증
   * @param {string} token - 재설정 토큰
   */
   validatePasswordResetToken: async (token) => {
    try {
      const res = await api.get(`/auth/password/validate-token?token=${encodeURIComponent(token)}`)
      return res.data // 메시지: "유효한 토큰입니다."
    } catch (err) {
      throw err.response?.data || err
    }
  },

  /**
   * 비밀번호 재설정 실행
   * @param {Object} resetData - 재설정 데이터
   * @param {string} resetData.token - 재설정 토큰
   * @param {string} resetData.newPassword - 새 비밀번호
   * @param {string} resetData.confirmPassword - 새 비밀번호 확인
   */
  resetPassword: async (resetData) => {
    try {
      const res = await api.post('/auth/password/reset', resetData)
      return res.data // 메시지: "비밀번호가 성공적으로 재설정되었습니다."
    } catch (err) {
      throw err.response?.data || err
    }
  }
}