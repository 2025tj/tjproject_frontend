import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signupThunk } from '../store/authThunk'
import { useNavigate } from 'react-router-dom'

const SignupForm = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nickname: ''
    })
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading } = useSelector(state => state.auth)

    const handleChange = (e) => {
        const { name, value  } = e.target
        setForm(prev => ({...prev, [name]: value}))
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setErrors({}) // 초기화
        try {
            await dispatch(signupThunk(form)).unwrap()
            alert('회원 가입 성공! 로그인 페이지로 이동합니다.')
            navigate('/login')
        } catch (err) {
            console.log(err)
            if (typeof err === 'object') {
                setErrors(err) // { email: '...', password: '...' } 형태
            } else {
                alert(err)
            }

            // setErrors('회원가입에 실패했습니다.')
            
            // if (err.response?.status === 400) {
            //     setErrors(err.response.data) // 유효성 검사 실패
            // } else if (err.response?.status === 409) {
            //     setErrors({email: '이미 사용중인 이메일 입니다.'})
            // } else {
            //     alert('예상치 못한 오류가 발생했습니다.')
            // }
        }
    }
  return (
    <>
        <form onSubmit={handleSubmit} style={{ maxWidth: 400 }} className='bg-white p-8 rounded shadow-md w-full max-w-md'>
            <div>
                <label>이메일</label><br />
                <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                />
                {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
            </div>

            <div>
                <label>비밀번호</label><br />
                <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                />
                {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
            </div>

            <div>
                <label>비밀번호 확인</label><br />
                <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                />
                {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
                {errors.passwordConfirmed && (
                <p style={{ color: 'red' }}>{errors.passwordConfirmed}</p>
                )}
            </div>

            <div>
                <label>닉네임</label><br />
                <input
                type="text"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                />
                {errors.nickname && <p style={{ color: 'red' }}>{errors.nickname}</p>}
            </div>

            <button type="submit" style={{ marginTop: '1rem' }} disabled={loading}>
                {loading ? '가입 중...' : '회원가입'}
            </button>
        </form>
    </>
  )
}

export default SignupForm
