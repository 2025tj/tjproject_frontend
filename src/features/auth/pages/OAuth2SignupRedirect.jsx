// import React, { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { useNavigate } from 'react-router'
// import {api} from '@shared/utils/api'
// import { checkLogin, saveAccessFromHeaders } from '../utils/tokenUtils'
// import { login } from '../store/authSlice'
// import SignupForm from '../components/SignupForm'

// const OAuth2SignupRedirect = () => {
//     const navigate = useNavigate()
//     const dispatch = useDispatch()
//     const [loading, setLoading] = useState(true)
//     const [initialValues, setInitialValues] = useState({
//         email: '',
//         password: '',
//         confirmPassword: '',
//         nickname: '',
//     })
//     const [error, setError]  = useState('')
//     const [provider, setProvider] = useState('')

//      // 1) pending-signup 정보 조회
//     const fetchPendingSignup = async () => {
//         try {
//             const {data} = await api.get("social/pending-social-signup")
//             setInitialValues(prev => ({ ...prev, email: data.email }))
//             setProvider(data.provider)
//         } catch (err) {
//             if (err.response?.status === 409) {
//                 setError('이미 가입된 이메일입니다.')
//             } else {
//                 // navigate('/')
//                 console.log("fetch 에러")
//             }
//         } finally {
//             setLoading(false)
//         }
//     }
    
//     useEffect(() => {
//         fetchPendingSignup()
//     }, [navigate])

//     // 2) 폼 제출 핸들러
//     const handleSubmit = async (form) => {
//             setError({})
//             setLoading(true)
//         try {
//             // provider 포함해 가입
//             await api.post('/auth/signup', {
//                 email: form.email,
//                 password: form.password,
//                 nickname: form.nickname,
//                 provider
//             })
//             const res = await api.get('/auth/oauth2/complete', { withCredentials:true })
//                 saveAccessFromHeaders(res.headers)
//             const user = await checkLogin()
//                 dispatch(login(user))
//                 navigate('/')
//         } catch (err) {
//             // 에러 분기(400/409 등) 처리
//             setError({ _global: '소셜 회원가입 중 오류가 발생했습니다.' })
//             setLoading(false)
//         }
//     }

//     if (loading) return <div>회원가입 정보를 불러오는 중…</div>

//     return (
//         <div>
//         <h2>소셜 회원가입 ({provider})</h2>
//             {error._global && <p style={{ color:'red' }}>{error._global}</p>}
//             <SignupForm
//                 initialValues={initialValues}
//                 disableFields={['email','confirmPassword']}
//                 errors={error}
//                 onSubmit={handleSubmit}
//                 submitting={loading}
//             />
//         </div>
//     )
// }

// export default OAuth2SignupRedirect
