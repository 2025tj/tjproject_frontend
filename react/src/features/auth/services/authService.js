import { authApi } from '../api/authApi'
import { userApi } from '@features/user/api/userApi'
import { ApiError } from '@shared/errors/ApiError'
import { unwrapApiResponse } from '@shared/utils/api'
import {
  saveAccessFromHeaders,
  clearAccessToken,
  getAccessToken,
  isTokenExpired,
  setAccessToken
} from '../utils'

export const authService = {
  loginService: async (credentials) => {
    console.log('authService 로그인 시작')
    // 로그인 api 호출
    const res = await authApi.login(credentials)
    const { success, message, data} = res.data
    if(!success) throw new Error(message || '로그인 실패')
    console.log('authService 로그인 api 완료')
    // 토큰 헤더 수동 추출 및 저장 (백업용)
    if (res.headers) {
      const tokenHeaders = ['access-token', 'Access-Token', 'authorization', 'Authorization']
      let token = null
      let foundHeader = null
      for (const headerName of tokenHeaders) {
        const value = res.headers[headerName]
        if (value) {
          token = value
          foundHeader = headerName
          break
        }
      }
      if (token) {
        console.log (`authService ${foundHeader}에서 토큰 발견:`, token)
        const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token
        setAccessToken(cleanToken)
        console.log('authService 토큰 수동 저장 완료')
      } else {
        console.warn('authService 응답 헤더에서 토큰을 찾을 수 없음')
      }
    }
    console.log('authService 로그인 응답처리 완료')

    return { user: data, message}
  },
  // loginAndFetchUser: async (credentials) => {
  //   await authApi.login(credentials)  
  //   const user = await userApi.getProfile() // 실제 사용자 정보 조회
  //   return user
  // },
  loginAndFetchUser: async (credentials) => {
    try {
      console.log('🔵 [authService] 로그인 시작')
      
      // 1. 로그인 API 호출
      const loginResponse = await authApi.login(credentials)
      console.log('🟢 [authService] 로그인 API 완료')
      
      // 2. 응답에서 수동으로 토큰 추출 및 저장 (백업용)
      if (loginResponse && loginResponse.headers) {
        console.log('🔍 [authService] 응답 헤더 확인:', Object.keys(loginResponse.headers))
        
        // 다양한 헤더명으로 토큰 찾기
        const tokenHeaders = ['access-token', 'Access-Token', 'authorization', 'Authorization']
        let token = null
        let foundHeader = null
        
        for (const headerName of tokenHeaders) {
          if (loginResponse.headers[headerName]) {
            token = loginResponse.headers[headerName]
            foundHeader = headerName
            break
          }
        }
        
        if (token) {
          console.log(`🟢 [authService] ${foundHeader}에서 토큰 발견:`, token)
          
          // Bearer 프리픽스 제거
          const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token
          
          // 수동으로 토큰 저장
          setAccessToken(cleanToken)
          console.log('✅ [authService] 토큰 수동 저장 완료')
        } else {
          console.warn('⚠️ [authService] 응답 헤더에서 토큰을 찾을 수 없음')
        }
      }
      
      // 3. 사용자 정보 조회
      console.log('🔵 [authService] 사용자 정보 조회 시작')
      const user = await userApi.getProfile()
      console.log('🟢 [authService] 사용자 정보 조회 완료')
      
      return user
      
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('💥 로그인 실패 메시지:', error.message)
        throw error
      }
      console.error('💥 알 수 없는 오류:', error)
      throw new Error('서버 오류가 발생했습니다.')
    }
  },

  signupOnly: async (userData) => {
    try {
        const res = await authApi.signup(userData)
        const userId = res.userId
        return userId
    } catch (err) {
      // AxiosError인지 확인하고 ApiError로 감싸기
      const res = err.response
      if (res?.data?.code) {
        throw new ApiError(res.data)
      }
      throw err
    }
  },

  logoutAndClear: async () => {
    await authApi.logout()
    clearAccessToken()
    window.location.href = '/login'
  },

  isAuthenticated: () => {
    const token = getAccessToken()
    return !!token && !isTokenExpired(token)
  },

  getToken: () => {
    return getAccessToken()
  },

  tryRestoreUser: async () => {
    const token = getAccessToken()
     console.log('🟡 기존 accessToken:', token)
    if (!token || isTokenExpired(token)) {
      try {
        console.log('authApi.refreshToken() 진입')
        const refreshed = await authApi.refreshToken()
        console.log('🟢 refresh 성공, 새 토큰 저장')
        saveAccessFromHeaders(refreshed.headers)
      } catch {
        console.log('🔴 refresh 실패, accessToken 제거')
        clearAccessToken()
        return null
      }
    }

    try {
      console.log('🔵 사용자 정보 조회 시도')
      const user = await userApi.getProfile()
      console.log('🟢 사용자 정보 조회 성공:', user)
      return user
    } catch {
      console.log('🔴 사용자 정보 조회 실패')
      return null
    }
  },
  //OAuth2 로그인 완료 후 토큰 수신 + 유저 조회
  oauth2CompleteAndFetchUser: async () => {
    try {
      await authApi.oauth2Complete() // 토큰만 헤더로 받음
      const user = await userApi.getProfile()
      return user
    } catch (err) {
      const res = err.response
      if (res?.data?.code) {
        throw new ApiError(res.data)
      }
      throw err
    }
  },
  //비밀번호 재설정 메일 요청
  requestPasswordReset: async (email) => {
    try {
      return await authApi.requestPasswordReset(email)
    } catch (err) {
      const res = err.response
      if (res?.data?.code) {
        throw new ApiError(res.data)
      }
      throw err
    }
  },
  // 비밀번호 재설정 토큰 검증
  validateResetToken: async (token) => {
    try {
      return await authApi.validatePasswordResetToken(token)
    } catch (err) {
      const res = err.response
      if (res?.data?.code) {
        throw new ApiError(res.data)
      }
      throw err
    }
  },
  // 비밀번호 재설정 실행
  resetPassword: async (resetData) => {
    try {
      return await authApi.resetPassword(resetData)
    } catch (err) {
      const res = err.response
      if (res?.data?.code) {
        throw new ApiError(res.data)
      }
      throw err
    }
  },
  refreshToken: async () => {
    try {
      const res = await authApi.refreshToken()
      saveAccessFromHeaders(res.headers)
      return true
    } catch (err) {
      const res = err.response
      if (res?.data?.code) {
        throw new ApiError(res.data)
      }
      throw err
    }
  },
  validateToken: async () => {
    try {
      return await authApi.validateToken()
    } catch (err) {
      const res = err.response
      if (res?.data?.code) {
        throw new ApiError(res.data)
      }
      throw err
    }
  },

  // 계정 복구
  reactivate: async (credentials) => {
    const res= await authApi.reactivateApi(credentials)
    return res
  }
}
