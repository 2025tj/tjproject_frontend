import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import PasswordResetForm from '../components/PasswordResetForm'
import { authService } from '../services/authService'

const PasswordResetPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [token] = useState(searchParams.get('token'))
  const [tokenValid, setTokenValid] = useState(null) // null: 검증 중, true: 유효, false: 무효

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false)
        return
      }

      try {
        await authService.validateResetToken(token)
        setTokenValid(true)
      } catch (error) {
        console.error('토큰 검증 실패:', error)
        setTokenValid(false)
      }
    }

    validateToken()
  }, [token])

  // 토큰 검증 중
  if (tokenValid === null) {
    return (
      <div>
        <h2>비밀번호 재설정</h2>
        <p>토큰을 검증하고 있습니다...</p>
      </div>
    )
  }

  // 토큰이 유효하지 않음
  if (tokenValid === false) {
    return (
      <div>
        <h2>비밀번호 재설정</h2>
        <p>유효하지 않거나 만료된 링크입니다.</p>
        <div>
          <button onClick={() => navigate('/auth/password-reset-request')}>
            다시 요청하기
          </button>
          <button onClick={() => navigate('/login')}>
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    )
  }

  // 토큰이 유효함
  return (
    <div>
      {/* <h2>새 비밀번호 설정</h2>
      <p>새로운 비밀번호를 입력해주세요.</p> */}
      <PasswordResetForm token={token} />
    </div>
  )
}

export default PasswordResetPage