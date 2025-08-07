import React, { useState } from 'react'
import { authService } from '../services'

const PasswordResetRequestForm = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      await authService.requestPasswordReset(email);
      setMessage('비밀번호 재설정 링크가 이메일로 발송되었습니다. 이메일을 확인해주세요.')
      setEmail('') // 폼 초기화
    } catch (error) {
      console.error('비밀번호 재설정 요청 실패:', error)
      const errorMessage = error.response?.data?.message || '오류가 발생했습니다. 다시 시도해주세요.'
      setMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">이메일:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="가입시 사용한 이메일을 입력하세요"
          disabled={loading}
        />
      </div>
      <button type="submit" disabled={loading || !email.trim()}>
        {loading ? '발송 중...' : '비밀번호 재설정 링크 발송'}
      </button>
      {message && (
        <p style={{ 
          color: message.includes('발송되었습니다') ? 'green' : 'red',
          marginTop: '10px'
        }}>
          {message}
        </p>
      )}
    </form>
  )
}

export default PasswordResetRequestForm