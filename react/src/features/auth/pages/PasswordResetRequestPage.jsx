import React from 'react'
import PasswordResetRequestForm from '../components/PasswordResetRequestForm'
import { useNavigate } from 'react-router'

const PasswordResetRequestPage = ( {onDone} ) => {
  const navigate = useNavigate()
  
  return (
    <div className="password-reset-page">
      {/* <h2>비밀번호 찾기</h2> */}
      {/* <p>가입시 사용한 이메일 주소를 입력하면 비밀번호 재설정 링크를 발송해드립니다.</p> */}
      <PasswordResetRequestForm />
      <hr />
      <div className="password-reset-actions">
        <button onClick={onDone}
          className="action-button back-button"
        >
          로그인으로 돌아가기
        </button>
        <button onClick={() => navigate('/signup')}
          className="action-button signup-button"
        >
          회원가입 페이지로 이동
        </button>
      </div>
    </div>
  )
}

export default PasswordResetRequestPage