// import React, {  useEffect, useState } from 'react'
// import { useNavigate } from 'react-router'
// import {api} from '@shared/utils/api'
// import { checkLogin, saveAccessFromHeaders } from '../utils/tokenUtils'
// import { useDispatch } from 'react-redux'
// import { login } from '../store/authSlice'

// const OAuth2LinkRedirect = () => {
//     const dispatch = useDispatch()
//     const navigate = useNavigate()
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState('')
//     const [email, setEmail] = useState('')
//     const [provider, setProvider] = useState('')
//     const [password, setPassword] = useState('')

//     // 1) 서버에서 pending 정보 가져오기
//     const fetchPendingLink = async () => {
//         try {
//             const { data } = await api.get('/social/pending-social-link')
//             setEmail(data.email)
//             setProvider(data.provider)
//         } catch (err) {
//             // navigate('/')
//             // return
//             console.error('연동 정보 조회 실패:', err)
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(()=> {
//         fetchPendingLink()
//     }, [navigate])

//     // 2) 폼 제출 핸들러
//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         setError('')
//         setLoading(true)

//         try {
//             // 2-1) 로컬 로그인 -> 쿠키(세션) 또는 토큰 확보
//             await api.post('/auth/login',{ email, password },{ withCredentials: true })

//             // b) 소셜-로컬 연동
//             await api.post('/users/link', { email, provider })

//             // 3) 소셜 로그인 완료 플로우 재사용
//             //    → /auth/oauth2/complete 호출해서
//             //    → 헤더에서 액세스 토큰 꺼내고
//             //    → checkLogin() 으로 유저 정보 로딩
//             //    → dispatch(login(user)) 으로 스토어에 저장
//             //    → 홈으로 이동
//             const res = await api.get('/auth/oauth2/complete', { withCredentials: true })
//                 saveAccessFromHeaders(res.headers);
//             const user = await checkLogin();
//             dispatch(login(user));
//             navigate('/')
//         } catch (e) {
//             console.error(e)
//             setError('비밀번호가 올바르지 않거나 연동 중 오류가 발생했습니다.')
//             setLoading(false)
//         }
//     }

//     if (loading) {
//         return <div>연동 정보를 확인 중입니다…</div>
//     }

//     if (error) {
//         return <div style={{ color: 'red' }}>{error}</div>
//     }


//   return (
//     <div style={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center' }}>
//       <h2>🔗 소셜 계정 연동 확인</h2>
//       <p>
//         <b>{email}</b> 계정에 <b>{provider}</b> 소셜 로그인을 연동하려고 합니다.
//       </p>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="password"
//           placeholder="해당 계정 비밀번호"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
//         />
//         <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
//           {loading ? '연동 중…' : '연동하기'}
//         </button>
//       </form>
//     </div>
//   )
// }

// export default OAuth2LinkRedirect
