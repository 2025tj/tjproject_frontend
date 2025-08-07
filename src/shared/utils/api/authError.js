let onAuthError = null // 콜백 초기화
export const setAuthErrorHandler = (fn) => {
  onAuthError = fn
}