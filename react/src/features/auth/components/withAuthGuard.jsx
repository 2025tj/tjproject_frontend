import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export const withAuthGuard = (Component) => {
  return (props) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
    if (!isAuthenticated) return <Navigate to="/login" replace />
    return <Component {...props} />
  }
}

export const withAdminGuard = (Component) => {
  return (props) => {
    const { isAuthenticated, user, loading} = useSelector((state) => state.auth)
    const isAdmin = user?.roles?.includes('ROLE_ADMIN')
    if (loading || user === null ) return <div>Loading...</div>
    console.log('@@@@',user)
    if (!isAuthenticated) return <Navigate to='/login' replace />
    if (!isAdmin) return <Navigate to='/' replace />
    return <Component {...props} />
  }
}