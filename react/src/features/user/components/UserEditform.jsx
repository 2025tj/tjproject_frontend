import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { fetchUserProfileThunk, updateUserInfoThunk } from '../store/userThunk'

const UserEditform = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.profile)
    const loading = useSelector(state => state.user.loading)
    const [form, setForm] = useState({ nickname: '', password: '' })

    useEffect(() => {
        // 이미 전역 상태에 유저가 있다면 초기값 설정
        if (user) {
            setForm(prev => ({
                ...prev,
                nickname: user.nickname || '',
            }))
        } else {
            dispatch(fetchUserProfileThunk())
        }
    }, [user, dispatch])

    const handleChange = e => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = () => {
    dispatch(updateUserInfoThunk(form))
      .unwrap()
      .then(() => {
        alert('수정 완료')
        navigate('/')
      })
      .catch(() => alert('수정 실패'))
  }

  if (!user) return null // 또는 <div>로딩 중...</div>

  return (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-token-text-primary mb-4">사용자 정보 수정</h3>
        <div className="space-y-3">
            <div>
                <label className="block text-sm font-medium text-token-text-secondary mb-2">
                    닉네임
                </label>
                <input
                    name="nickname"
                    value={form.nickname}
                    onChange={handleChange}
                    placeholder="닉네임을 입력하세요"
                    className="w-full px-3 py-2 border border-token-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-token-interactive-accent-default focus:border-transparent transition-colors"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-token-text-secondary mb-2">
                    새 비밀번호
                </label>
                <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="새 비밀번호를 입력하세요"
                    type="password"
                    className="w-full px-3 py-2 border border-token-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-token-interactive-accent-default focus:border-transparent transition-colors"
                />
            </div>
            <div className="mt-3 p-3 bg-token-main-surface-secondary rounded-md">
                <p className="text-sm text-token-text-secondary">
                    비밀번호는 변경하지 않으려면 빈 칸으로 두세요.
                </p>
            </div>
            <div className="pt-2">
                <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="w-full px-4 py-2 bg-token-interactive-accent-default text-white rounded-md hover:bg-token-interactive-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {loading ? '수정 중...' : '정보 수정'}
                </button>
            </div>
            
        </div>
    </div>
  )
}

export default UserEditform
