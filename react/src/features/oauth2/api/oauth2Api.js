import {
  postAndUnwrap,
  getAndUnwrap,
  deleteAndUnwrap,
} from '@shared/utils/api/apiWrapper'
import { api } from '../../../shared/utils/api'

export const oauth2Api = {
    /**
   * 소셜 계정 연동 요청
   * @param {Object} data - 연동 정보 { provider, providerId }
   */
  linkSocial: async (data) => {
     // 204 No Content or 200 OK → unwrap 필요 없음
    return await postAndUnwrap('/social/link', data)
  },

  /**
   * 소셜 계정 연동 해제
   * @param {string} provider - 'google' | 'kakao' 등
   */
  unlinkSocial: async (provider) => {
    return await api.delete(`/social/unlink/${provider}`)
  },

  /**
   * 연동된 소셜 프로바이더 목록 조회
   * @returns {Promise<string[]>} ex) ['google', 'kakao']
   */
  getLinkedProviders: async () => {
    console.log('OAuth2Api/getLinkedProviders 진입')
    const res = await api.get('/social/linked-providers')
    console.log('OAuth2Api/res :', res)
    return res.data
  },

}