import React from 'react'
import SignupForm from '../components/SignupForm'
import LoginForm from '../components/LoginForm'
import { useNavigate } from 'react-router'
import OAuth2LoginButton from '../components/OAuth2LoginButton'

const LoginPage = () => {
  const navigate = useNavigate()
  return (
    <div>
      <h2>소셜 로그인</h2>
      <OAuth2LoginButton />
      <hr />
      <LoginForm />

      {/* 비밀번호 찾기 링크 추가 - 기존 경로 구조에 맞춤 */}
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <button 
          onClick={() => navigate('/auth/password-reset-request')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'blue', 
            textDecoration: 'underline',
            cursor: 'pointer' 
          }}
        >
          비밀번호를 잊으셨나요?
        </button>
      </div>

      <button onClick={() => navigate('/signup')}>
        회원가입 페이지로 이동
      </button>
    </div>
  )
}

export default LoginPage
