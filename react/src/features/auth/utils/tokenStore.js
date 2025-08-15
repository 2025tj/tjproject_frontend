import { extractAccessToken } from "./tokenUtils"
// accessToken을 브라우저 메모리에 안전하게 저장/관리하는 모듈
let accessToken = null  // 외부에서 접근 불가한 모듈 스코프 변수

/**
 * accessToken 설정
 * @param {string} token - 새 access token
 */
export const setAccessToken = (token) => {
  accessToken = token
}

/**
 * accessToken 조회
 * @returns {string|null} access token 값
 */
export const getAccessToken = () => {
  return accessToken
}

/**
 * accessToken 제거
 */
export const clearAccessToken = () => {
  accessToken = null
}

export const saveAccessFromHeaders = (headers) => {
  console.log('headers :', headers)
  const token = extractAccessToken(headers)
  console.log('token :', token)
  if (token) setAccessToken(token)
}