import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { logoutThunk } from '../../../features/auth/store/authThunk'

const Header = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await dispatch(logoutThunk()).unwrap()
            navigate('/login')
        } catch (err) {
            console.error('로그아웃 요청 실패:', err)
        }
    }

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
            <h2><Link to="/">홈으로가기</Link></h2>
            <nav>
                {isAuthenticated ? (
                    <>
                        <Link to="/mypage">마이페이지</Link>
                        <button onClick={handleLogout}>로그아웃</button>
                    </>
                    
                ) : (
                    <Link to="/login">로그인</Link>
                )}
            </nav>
        </header>
    )
}

export default Header
