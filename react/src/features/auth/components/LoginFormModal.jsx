import { Modal, Input } from "antd";
// import SignupForm from '../components/SignupForm'
import LoginForm from '@features/auth/components/LoginForm'
import { useNavigate } from 'react-router'
import OAuth2LoginButton from '@features/auth/components/OAuth2LoginButton'
import { useEffect, useState } from "react";
import PasswordResetForm from "@features/auth/components/PasswordResetForm";
import PasswordResetRequestPage from "@features/auth/pages/PasswordResetRequestPage";
import '../css/LoginFormModal.css'
import { useDispatch } from "react-redux";
import { clearError, clearWarning } from "../store/authSlice";


const LoginFormModal = ( {open, onclose}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // 추가 상태: 비밀번호 재설정 모드인지 여부
  const [isResetMode, setIsResetMode] = useState(false)
  const [resetForm, setResetForm] = useState(false)

  useEffect(() => {
    if (open) {
      setIsResetMode(false)
      setResetForm(true)
      dispatch(clearError())
      dispatch(clearWarning())
    }
  },[open, dispatch])

  const handleClose = () => {
    setIsResetMode(false)
    setResetForm(false)
    dispatch(clearError())
    dispatch(clearWarning())
    onclose()
  }

  return (    
    <>
    <Modal
      // title={isResetMode ? '비밀번호 재설정' : '로그인'}
      title={null}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={400}
      centered
      className="login-modal"
    >
      {!isResetMode ? (
        <>
          <div className="login-modal-container">
            <div className="login-header">
              <div className="login-logo">
                <img
                  src="/src/images/Logo.jpg"
                  alt="NewsEmo Logo"
                  style={{
                    width: '120px',
                    height: 'auto',
                    display: 'flex',
                    cursor: 'pointer'
                  }}
                />
              </div>
              <h1 className="login-title">NewsEmo에 오신걸 환영합니다</h1>
            </div>
            
            <div className="email-login-section">
              <LoginForm resetForm={resetForm} />
            </div>

            <div className="signup-section">
              <span className="signup-text">
                계정이 없으신가요?
                <button
                  onClick={() => {
                    handleClose()
                    navigate('/signup')
                  }}
                  className="signup-link"
                >
                  회원가입
                </button>
              </span>
            </div>

            <div className="password-reset-section">
              <span className="reset-text">
                비밀번호를 잊으셨나요?
                <button
                  onClick={() => setIsResetMode(true)}
                  className="reset-link"
                >
                  비밀번호 재설정
                </button>
              </span>
            </div>

            <div className="divider">
              <div className="divider-line"></div>
              <div className="divider-text">또는</div>
              <div className="divider-line"></div>
            </div>

            <div className="oauth2-section">
              <OAuth2LoginButton />
            </div>

            {/* 비밀번호 찾기 링크 추가 - 기존 경로 구조에 맞춤
            <div style={{ textAlign: 'center', margin: '10px 0' }}>
              <button 
                onClick={() => setIsResetMode(true)}
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
            <button onClick={() => {
              onclose()
              navigate('/signup')
            }}>
              회원가입 페이지로 이동
            </button> */}
          </div>
        </>
      ) : (
        <>
          <div className="login-modal-container">
            <PasswordResetRequestPage onDone={() => {
              setIsResetMode(false)
            }} />
          </div>
        </>
      )}

      

      {/* <input type='text' placeholder='이메일'></input>  <br />
      <input type="text"  placeholder='비밀번호' security=''></input> */}
      {/* <Input placeholder="아이디" style={{marginBottom:10}}/>
      <Input.Password placeholder="pwd" style={{marginBottom:10}}/>

      <button  onClick={onclose}>로그인하기</button> */}
    </Modal>
    </>  
  )
}

export default LoginFormModal
