import { Modal, Input } from "antd";
// import SignupForm from '../components/SignupForm'
import LoginForm from '@features/auth/components/LoginForm'
import { useNavigate } from 'react-router'
import OAuth2LoginButton from '@features/auth/components/OAuth2LoginButton'
import { useState } from "react";
import PasswordResetForm from "../features/auth/components/PasswordResetForm";
import PasswordResetRequestPage from "../features/auth/pages/PasswordResetRequestPage";


const Login = ( {open, onclose}) => {
  const navigate = useNavigate()

  // 추가 상태: 비밀번호 재설정 모드인지 여부
  const [isResetMode, setIsResetMode] = useState(false)
  return (    
    <>
    <Modal
      title={isResetMode ? '비밀번호 재설정' : '로그인'}
      open={open}
      onCancel={() => {
        onclose()
        setIsResetMode(false) // 닫을 때 초기화
      }}
      footer={null}
    >
      {!isResetMode ? (
        <>
      <div><OAuth2LoginButton /></div>
      <div><LoginForm /></div>

      {/* 비밀번호 찾기 링크 추가 - 기존 경로 구조에 맞춤 */}
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
      </button>
        </>
      ) : (
        <>
          <PasswordResetRequestPage onDone={() => {
            setIsResetMode(false)
            onclose()
          }} />
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

export default Login
