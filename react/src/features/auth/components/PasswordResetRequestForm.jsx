import React, { useState } from 'react'
import { authService } from '../services'
import {Input, Button} from 'antd'

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
    <div className="password-reset-container">
      <div className="password-reset-header">
        <h2 className="password-reset-title">비밀번호 재설정</h2>
        <p className="password-reset-description">
          가입시 사용한 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다.
        </p>
      </div>
    <form onSubmit={handleSubmit} className="password-reset-form">
      <div className="form-field">
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="가입시 사용한 이메일을 입력하세요"
          disabled={loading}
          size="large"
          className="form-input"
        />
      </div>
      <div className="form-submit">
        {/* 🧪 테스트용 버튼 추가 */}
        {/* <button 
          type="button" 
          onClick={() => console.log('테스트 버튼 클릭됨', email)}
          style={{ 
            width: '100%', 
            height: '40px', 
            backgroundColor: 'red', 
            color: 'white',
            marginBottom: '10px'
          }}
        >
          테스트 버튼 (클릭해보세요)
        </button> */}
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="submit-button"
          style={{
            width: '100%',
            height: '40px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#10A37F',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          {loading ? '발송 중...' : '비밀번호 재설정 링크 발송'}
        </button>
      </div>
    </form>
      {message && (
        <div className={`message ${message.includes('발송되었습니다') ? 'success-message' : 'error-message'}`}>
          {message}
        </div>
      )}
    </div>
  )
}

export default PasswordResetRequestForm