// jwt 디코딩, 만료 여부 판단
import * as jwtDecode from 'jwt-decode'

// // 응답 헤더에서 AccessToken 추출
export const extractAccessToken = (headers) => {
  const tokenHeaderNames = ['access-token', 'Access-Token', 'authorization', 'Authorization']

  for (const name of tokenHeaderNames) {
    const raw = headers[name]
    if (raw) {
      return raw.startsWith('Bearer ') ? raw.slice(7) : raw
    }
  }

  return null
}
// export const extractAccessToken = (headers) => {
//   const raw = headers['access-token'] || headers['Access-Token']
//   // const raw = headers['access-token'];
//   return raw?.startsWith('Bearer ') ? raw.slice(7) : raw
// }

// 토큰이 곧 만료되는지 확인
export const isTokenExpiringSoon = (token, buffer = 120) => {
  try {
    const { exp } = jwtDecode(token)
    const now = Math.floor(Date.now() / 1000)
    return exp - now < buffer
  } catch {
    return true
  }
}

// 토큰이 만료되었는지 확인
export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token)
    return Date.now() / 1000 > exp
  } catch {
    return true
  }
} 

// import {api} from '@shared/utils/api'
// import * as jwtDecode from 'jwt-decode'
// // import { getAccessToken as getTokenFromStore } from './tokenStorage';
// import { 
//   login as loginAction,
//   logout as logoutAction,
//   setAccessToken as setAccessTokenAction,
//   clearAccessToken as clearAccessTokenAction,
//   setWarning as setWarningAction,
//   clearWarning as clearWarningAction,
//  } from '../store/authSlice';
// import store from '@app/store';

// //---- 토큰 유틸들 ----

// export const isTokenExpiringSoon = (token, buffer = 120)=> {
//   try {
//     const { exp} =jwtDecode(token)
//     const now = Math.floor(Date.now() / 1000)
//     return exp - now < buffer
//   } catch {
//     return true
//   }
// }

// /**
//  * 토큰이 만료되었는지 확인
//  * @returns {boolean} 만료되었으면 true
//  */
// export function isTokenExpired() {
//   const token = getAccessToken()
//   if (!token) return true
//   try {
//     const { exp } = jwtDecode(token)
//     return Date.now() / 1000 > exp
//   } catch {
//     return true
//   }
// }

// export const extractAccessToken = (headers) => {
//   const raw = headers['access-token'] || headers['Access-Token']
//   return raw?.startsWith('Bearer ') ? raw.slice(7) : raw
// }


// // Access Token getter
// export const getAccessToken = () => {
//   return store.getState().auth.accessToken
// }


// //---- redux Dispatch 래핑함수들

// // 리덕스에 accessToken 저장
// export const saveAccessToken = (token) => {
//   store.dispatch(setAccessTokenAction(token))
// }

// // 리덕스 accessToken 제거
// export const removeAccessToken = () => {
//   store.dispatch(clearAccessTokenAction())
// }
// // 응답 헤더에서 AccessToken을 꺼내 리덕스에 저장
// export const saveAccessFromHeaders = (headers) => {
//   const token = extractAccessToken(headers)
//   if (token) saveAccessToken(token)
// }

// export const saveUserInfo = (user) => {
//   store.dispatch(loginAction(user))
// }

// export const removeUserInfo = () => {
//   store.dispatch(logoutAction())
// }

// export const setWarning = (msg) => {
//   store.dispatch(setWarningAction(msg))
// }

// export const clearWarning = () => {
//   store.dispatch(clearWarningAction())
// }


// /**
//  * 로그인 여부 확인: 토큰존재 && 만료전
//  * @returns {boolean}
//  */
// export const isLoggedIn = () => {
//   return !!getAccessToken() && !isTokenExpired();
// };

// /**
//  * 사용자 정보 조회 (users/me)
//  * @returns {Promise<import('./axios').AxiosResponse['data']|null>}
//  */
// export const checkLogin = async () => {
//     try {
//         const res = await api.get('/users/me/details')
//         return res.data
//         // return res.data.email // 예: 이메일주소
//     } catch {
//         return null
//     }
// }

// // /**
// //  * 응답 헤더에서 AccessToken을 꺼내 리덕스에 저장
// //  * @param {import('axios').AxiosResponseHeaders} headers
// //  */
// // export const saveAccessFromHeaders = (headers) => {
// //     const raw = headers['access-token'] || headers['Access-Token'];
// //     if (!raw) return


// //     // 서버로부터 Bearer <accessToken>형식으로 받았음
// //     const accessToken = raw.startsWith('Bearer ') 
// //     ? raw.substring(7)
// //     : raw

// //     // 리덕스에 저장
// //     store.dispatch(setAccessTokenAction(accessToken))
// // }


// export {
//   // getTokenFromStore as getToken,
//   saveAccessToken as saveToken,
//   removeAccessToken as removeToken
// }