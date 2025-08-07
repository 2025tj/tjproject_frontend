import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export const withAuthGuard = (Component) => {
  return (props) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
    if (!isAuthenticated) return <Navigate to="/login" replace />
    return <Component {...props} />
  }
}