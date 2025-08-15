import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedAdminRoute = () => {
    const { isAuthenticated, user, loading } =useSelector((state) => state.auth)
    const isAdmin = user?.roles?.includes('ROLE_ADMIN')

    if (loading || user === null) return <div>Loading...</div>
    if (!isAuthenticated) return <Navigate to="/login" replace />
    if (!isAdmin) return <Navigate to="/" replace />
    
    // 조건 통과시 Outlet을 통해 자식 라우트 렌더링
    return <Outlet />
}
export default ProtectedAdminRoute