import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({isAuthenticated, children}) => {
    // const token = localStorage.getItem('accessToken')
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
  return children
}

export default PrivateRoute
