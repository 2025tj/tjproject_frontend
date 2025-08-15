import { getAndUnwrap } from '@shared/utils/api'
import { postAndUnwrap, putAndUnwrap } from '../../../shared/utils/api'
import { api} from '@shared/utils/api'

export const userApi = {
  /**
   * 현재 로그인한 사용자 이메일 조회 (간략 정보)
   * GET /api/users/me
   */
  getCurrentUserEmail: () => getAndUnwrap('/users/me'),

  /**
   * 현재 로그인한 사용자 상세 정보 조회
   * GET /api/users/me/details
   */
  getProfile: () => getAndUnwrap('/users/me/details'),

  /**
   * 현재 사용자 정보 수정
   * PUT /api/users/me
   * @param {Object} updateData - 사용자 수정 데이터
   * @param {string} [updateData.nickname]
   * @param {string} [updateData.password]
   * @param {string} [updateData.name]
   */
  updateUserInfo: (updateData) =>
    putAndUnwrap('/users/me', updateData),

  /**
   * 소셜 계정 연동
   * POST /api/users/link-social
   * @param {Object} linkData - 연동할 데이터
   * @param {string} linkData.email
   * @param {string} linkData.provider
   */
  linkSocial: (linkData) =>
    postAndUnwrap('/users/link-social', linkData),

  /**
   * 소셜 연동 대기 중인 사용자 정보 조회
   * GET /api/users/pending-social-link
   */
  getPendingSocialLink: () =>
    getAndUnwrap('/users/pending-social-link'),

  // // 회원 탈퇴
  withdrawApi: async (password) => {
    const res = await api.delete('/users/me', {
      data: password ? { password} : {}
    })
    return res.data
  }
}