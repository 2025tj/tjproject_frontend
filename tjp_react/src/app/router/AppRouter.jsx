import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '@features/dashboard/pages/HomePage'
import LoginPage from '@features/auth/pages/LoginPage'
import OAuth2Redirect from '@features/auth/pages/OAuth2Redirect'
import PrivateRoute from './PrivateRoute'
import MyPage from '@features/user/pages/MyPage'
import EmailVerify from '@features/auth/pages/EmailVerify'
import Header from '@shared/components/layout/Header'
import SignupPage from '@features/auth/pages/SignupPage'
import OAuth2LinkComplete from '@features/auth/components/OAuth2LinkComplete'
import PasswordResetRequestPage from '@features/auth/pages/PasswordResetRequestPage'
import PasswordResetPage from '@features/auth/pages/PasswordResetPage'
import { useAuth } from '@features/auth/hooks/useAuth'

const AppRouter = () => {
    const { isAuthenticated } = useAuth()


    return (
        <BrowserRouter>
            <Header />
            <Routes>
                {/* 공개 페이지 */}
                <Route path="/" element={<Home />} />
                
                {/* 인증이 필요한 페이지 */}
                <Route path="/mypage" element={
                <PrivateRoute>
                    <MyPage />
                </PrivateRoute>
                } />
                
                {/* 인증 관련 페이지들 - 이미 로그인된 경우 홈으로 리다이렉트 */}
                <Route path="/login" element={
                    isAuthenticated 
                        ? <Navigate to="/" replace />
                        : <LoginPage />
                } />
                
                {/* 회원가입 */}
                <Route path="/signup" element={
                    isAuthenticated 
                        ? <Navigate to="/" replace />
                        : <SignupPage />
                } />

                {/* 비밀번호 재설정 관련 */}
                <Route path="/auth/password-reset-request" element={
                    isAuthenticated 
                        ? <Navigate to="/" replace />
                        : <PasswordResetRequestPage />
                } />
                    
                <Route path="/auth/password-reset" element={
                    isAuthenticated 
                        ? <Navigate to="/" replace />
                        : <PasswordResetPage />
                } />
                
                {/* OAuth2 관련 */}
                <Route path="/oauth2/login" element={<OAuth2Redirect />} />
                <Route path="/oauth2/link-complete" element={<OAuth2LinkComplete />} />
                
                {/* 이메일 인증 */}
                <Route path="/email/verify" element={<EmailVerify />} />
                
                {/* 기타 리다이렉트나 404 처리 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )


}

export default AppRouter