import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import { loginThunk, reactivateThunk } from '../store/authThunk'
import { clearWarning, clearError, setError } from '../store/authSlice'
import { Input, Modal, message } from 'antd'

const LoginForm = ({resetForm}) => {
  const [form, setForm] = useState({ email: '', password: '' })
  // const [error, setError] = useState('')
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [restorePwd, setRestorePwd] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const { loading, warning, error } = useSelector(state => state.auth)

  useEffect(() => {
    if (resetForm) {
      setForm({email: '', password: ''})
      setShowRestoreModal(false)
      setRestorePwd('')
    }
  },[resetForm])

  // OAuth2 실패로 넘어온 메시지 처리
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const oauthErr = params.get('oauth_error')
    if (oauthErr) {
      dispatch(setError(oauthErr))
      // 메세지 내용에 따라 복구 CTA 노출
      if (oauthErr.includes('탈퇴 유예') || oauthErr.toLowerCase().includes('inactive')) {
        setShowRestoreModal(true)
      }
    }
  },[location.search, dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const isInactiveByShape = (errLike) => {
    // LoginThunk return값에 따라 대응
    const code = errLike?.code || errLike?.response?.data?.code || ''
    const msg = errLike?.message || errLike?.response?.data?.message || (typeof errLike === 'string' ? errLike : '')
    if (code === 'ACCOUNT_INACTIVE') return true
    const lower = String(msg).toLowerCase()
    return /inactive/.test(lower) || /탈퇴 유예/.test(msg || '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // setError('')
    // 화면 메세지 초기화
    dispatch(clearWarning())
    dispatch(clearError())

    try {
      await dispatch(loginThunk(form)).unwrap()
      navigate('/')
    } catch (err) {
      console.error('로그인 실패:', err)
      if (err?.code === 'ACCOUNT_INACTIVE') {
        // 계정 복구 모달
        setShowRestoreModal(true)
      } else {
        // 일반 에러 처리
        dispatch(setError(err?.message || '로그인 실패'))
      }
    }
      // if (err?.code && err?.message) {
      //   setError(err.message)
      // } else if (err?.response?.data?.message) {
      //   setError(err.response.data.message)
      // } else {
      //   setError('서버 오류가 발생했습니다.')
      // }
      
      //   console.log('에러 응답:', err.response)
      //   console.log('에러 응답 헤더:', err.response.headers)
      //   console.log('에러 응답 데이터:', err.response.data)
      //   console.log('에러 응답 상태:', err.response.status)
      // } else if (err.request) {
      //   console.log('요청은 보냈지만 응답 없음:', err.request)
      // } else {
      //   console.log('요청 설정 중 에러:', err.message)
      // }
      // if (errMsg.includes('401')) {
      //   setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      // } else {
      //   setError(errMsg || '서버 오류. 잠시 후 다시 시도해주세요.')
      // }
  }

  const handleRestore = async () => {
    try {
      const pwd = restorePwd || form.password
      await dispatch(reactivateThunk({email: form.email, password: pwd})).unwrap()
      message.success('계정이 복구되었습니다.')
      setShowRestoreModal(false)
      navigate('/')
    } catch (err) {
      message.error(err?.message || '계정 복구에 실패했습니다.')
    }
  }

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="error-message">{error}</div>}
        {warning && <div className="warning-message">{warning}</div>}
        <div className="form-field">
          <Input
            type="email"
            name="email"
            placeholder="이메일 주소"
            value={form.email}
            onChange={handleChange}
            className="form-input"
            autoComplete='email'
            size="large"
          />
        </div>
        <div className="form-field">
          <Input.Password
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            className="form-input"
            autoComplete='current-password'
            size="large"
          />
        </div>
        <div className="form-submit">
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </div>
      </form>

      {/* 계정 복구 모달 */}
      <Modal
        title='계정 복구'
        open={showRestoreModal}
        onOk={handleRestore}
        onCancel={()=>setShowRestoreModal(false)}
        okText='복구'
        cancelText='취소'
        confirmLoading={loading}
        okButtonProps={{
          style: {
            backgroundColor: '#1677ff',
            color: 'white'
          }
        }}
      >
        <p>탈퇴 유예 중인 계정입니다. 복구하려면 비밀번호를 입력하세요.</p>
        <Input value={form.email} disabled style={{marginBottom: 8}} />
        <Input.Password
          placeholder='비밀번호'
          value={restorePwd}
          onChange={e => setRestorePwd(e.target.value)}
        />
      </Modal>
    </div>
    // <form onSubmit={handleSubmit}>
    //   {error && <p style={{color:'red'}}>{error}</p>}
    //   {warning && <p style={{ color: 'orange' }}>{warning}</p>}
    //   <Input
    //     type="email"
    //     name="email"
    //     placeholder="이메일"
    //     value={form.email}
    //     onChange={handleChange}
    //     style={{marginBottom:10}}
    //     autoComplete='email'
    //   /><br />
    //   <Input.Password
    //     name="password"
    //     placeholder="비밀번호"
    //     value={form.password}
    //     onChange={handleChange}
    //     style={{marginBottom:10}}
    //     autoComplete='current-password'
    //   /><br />
    //   <button type="submit"disabled={loading}>
    //     {loading ? '로그인 중...' : '로그인'}
    //   </button>

    //   {/* 계정 복구 모달 */}
    //   <Modal
    //     title='계정 복구'
    //     open={showRestoreModal}
    //     onOk={handleRestore}
    //     onCancel={()=>setShowRestoreModal(false)}
    //     okText='복구'
    //     cancelText='취소'
    //     confirmLoading={loading} // 전역 loading 사용
    //     okButtonProps={{
    //       style: {
    //         backgroundColor: '#1677ff',
    //         color: 'white'
    //       }
    //     }}
    //   >
    //     <p>탈퇴 유예 중인 계정입니다. 복구하려면 비밀번호를 입력하세요.</p>
    //     <Input value={form.email} disabled style={{marginBottom: 8}} />
    //     <Input.Password
    //       placeholder='비밀번호'
    //       value={restorePwd}
    //       onChange={e => setRestorePwd(e.target.value)}
    //     />
    //   </Modal>
    // </form>
  )
}

export default LoginForm
