import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({isAuthenticated, loading, children}) => {
  // if (loading) {
  //   // 인증 상태 확인 중일 때는 아무것도 렌더링하지 않거나 로딩 UI 표시
  //   return null
  // }
  // const token = localStorage.getItem('accessToken')
  if (!isAuthenticated) {
      return <Navigate to="/login" replace />
  }
  return children
}

export default PrivateRoute
