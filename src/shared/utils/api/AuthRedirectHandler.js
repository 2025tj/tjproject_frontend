import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutThunk } from '@features/auth/store/authThunk'
import { setAuthErrorHandler } from './client'

const AuthRedirectHandler = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

    // 콜백 등록 (1회)
  useEffect(() => {
    setAuthErrorHandler(() => {
      dispatch(logoutThunk())
      navigate('/login')
    })
  }, [dispatch, navigate])

  return null // UI 출력 없음
}

export default AuthRedirectHandler
