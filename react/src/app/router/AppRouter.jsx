import { BrowserRouter, Routes, Route ,Navigate, useNavigate, useLocation} from 'react-router-dom'
import Home from '../../features/dashboard/HomePage'
import LoginPage from '../../features/auth/pages/LoginPage'
import OAuth2Redirect from '../../features/auth/pages/OAuth2Redirect'
import PrivateRoute from './PrivateRoute'
import { useDispatch, useSelector } from 'react-redux'
import MyPage from '../../features/user/pages/MyPage'
import EmailVerify from '../../features/email/pages/EmailVerify'
// import Header from '../../shared/components/layout/Header'
import SignupPage from '../../features/auth/pages/SignupPage'
// import SocialLinkPage from '@features/auth/pages/SocialLinkPage'
// import OAuth2LinkRedirect from '../../features/auth/pages/OAuth2LinkRedirect'
// import OAuth2SignupRedirect from '../../features/auth/pages/OAuth2SignupRedirect'
import OAuth2LinkComplete from '../../features/auth/components/OAuth2LinkComplete'
import PasswordResetRequestPage from '../../features/auth/pages/PasswordResetRequestPage'
import PasswordResetPage from '../../features/auth/pages/PasswordResetPage'
import { withAdminGuard, withAuthGuard } from '../../features/auth/components/withAuthGuard'
import AuthRedirectHandler from '../../shared/utils/api/AuthRedirectHandler'
// -------------------------------------------------------------------------
import Admin from "../../Admin";
import Main from "../../Routes/Start";
// import PageA from "./Routes/PageA";
import Info from "../../Routes/Info";
import Semi from '../../Routes/Semi';
import Register from "../../Routes/Register";
import CompanyInfo from '../../pages/CompanyInfo';
import MentionPage from '../../pages/MentionPage';
import Reputation from '../../pages/Reputation';
import AssociationPage from '../../pages/AssociationPage';
import CompareKeyword from '../../pages/CompareKeyword';
// import MyPage from './pages/MyPage';
import Header from '../../Routes/Header';
import Footer from '../../Routes/Footer';
import React, { useState } from 'react'
import { fetchCompaniesByName, fetchCompaniesByType, setSearchTerm } from '../../redux/reducerSlices/companySearchSlice'
import Chatbot from '../../ChatBot'
import { Radio } from 'antd'
import SubscriptionManagement from '../../features/subscription/pages/SubscriptionManagement'
import SubscriptionPlans from '../../features/subscription/pages/SubscriptionPlans'

import '../../App.css'
import AdminUserPage from '../../features/admin/pages/AdminUserPage'
// SearchBar 정의 부분
// const SearchBar = React.memo(({ searchTerm, setSearchTerm, onSubmit, loading, searchType, setSearchType }) => { // (A) 여기서 받는 props는 onSubmit, loading, navigate 뿐입니다.
//   // console.log("임포트확인:" ,setSearchTerm)

//   return (
//     <div className="search-bar-wrapper">
//       {/* 라디오 버튼 추가 */}
//       <Radio.Group
//         value={searchType}
//         onChange={e => setSearchType(e.target.value)}
//         style={{ marginBottom: 8 }}
//       >
//         <Radio value="name">기업이름</Radio>
//         <Radio value="type">분야</Radio>
//       </Radio.Group>

//       <form onSubmit={onSubmit} className="search-form">
//         <input
//           type="text"
//           placeholder="회사명 입력하세요..."
//           value={searchTerm} // (B) 이 searchTerm은 props가 아니라 App의 변수를 직접 사용하고 있습니다.
//           onChange={(e) => setSearchTerm(e.target.value)} // (C) 이 setSearchTerm은 어디에도 정의되지 않은 변수라 에러가 발생합니다!
//           disabled={loading}
//           className="search-input"
//         />
//         <button
//           type="submit"
//           className="search-button"
//           disabled={loading}
//         >
//           {loading ? "검색중..." : "검색"}
//         </button>
//       </form>
//     </div>
//   );
// });

const AppRouter = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    // 페이지에 인증요구하도록
    const ProtectedMyPage = withAuthGuard(MyPage)
    const ProtectedSubscriptionManagement = withAuthGuard(SubscriptionManagement)
    const ProtectedAdminUserPage = withAdminGuard(AdminUserPage)

    const [currentPage, setCurrentPage] = useState("");

    // const [loading, setLoading] = useState(false);
    // const [company, setCompany] = useState([]);
    const [searchTerm, setSearchTerms] = useState("");
    const [searchType, setSearchType] = useState("")

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation()


    // const toLogin = () => {
    //   navigate("/Login");
    // };

    const toRegister = () => {
        navigate("/register");
    };

    const handleNavigation = (page) => {
        dispatch(setCurrentPage(page));
    };

    //  const handleSearch = (e) => {
    //   e.preventDefault()
    //   if (!searchTerm.trim()) return;
    //   // dispatch(fetchCompaniesByName(inputValue));
    // };

    const handleSubmit = (e) => {
        // useCallback((e) => {
        e.preventDefault();
        // if (searchTerm.trim()) 
        //   dispatch(setSearchTerm(searchTerm)); // 가져옴
        //   // (searchTerm.trim());
        //   dispatch(fetchCompaniesByName(searchTerm.trim()))   // 검색어 찾기
        // navigate("/semi")

        if (!searchTerm.trim()) return;

        dispatch(setSearchTerm(searchTerm));
        if (searchType === "name") {
        dispatch(fetchCompaniesByName(searchTerm.trim()));
        } else if (searchType === "type") {
        // 분야로 검색하는 액션을 따로 만들어서 dispatch
        dispatch(fetchCompaniesByType(searchTerm.trim()));
        }
        navigate("/semi/company")
    }


    return (
        <>
            <AuthRedirectHandler />
            <Header
                // toLogin={toLogin}
                toRegister={toRegister}
                handleNavigation={handleNavigation}
            // navigate={navigate}
            // SearchBar={SearchBar}
            // Content={Content}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow pb-32">
               
            
            </main>
            <Chatbot />
            <Routes>
                <Route path="/" element={<Main />} />
                
                {/* 마이페이지 - 인증 필요 */}
                <Route path="/mypage" element={<ProtectedMyPage />} />
                
                {/* 로그인 - 이미 로그인된 경우 홈으로 리다이렉트 */}
                <Route path="/login" element={
                    !isAuthenticated 
                        ? <LoginPage />
                        : <Navigate to="/" replace />
                } />
                
                {/* 회원가입 */}
                <Route path="/signup" element={<SignupPage />} />
                
                {/* OAuth2 관련 */}
                <Route path="/oauth2/login" element={<OAuth2Redirect />} />
                <Route path="/oauth2/link-complete" element={<OAuth2LinkComplete />} />
                
                {/* 이메일 인증 */}
                <Route path="/email/verify" element={<EmailVerify />} />
                
                {/* 🆕 비밀번호 재설정 관련 */}
                <Route path="/auth/password-reset-request" element={
                    !isAuthenticated 
                        ? <PasswordResetRequestPage />
                        : <Navigate to="/" replace />
                } />
                <Route path="/auth/password-reset" element={
                    !isAuthenticated 
                        ? <PasswordResetPage />
                        : <Navigate to="/" replace />
                } />
                
                {/* 기타 리다이렉트나 404 처리 */}
                <Route path="*" element={<Navigate to="/" replace />} />

                {/*------------------------------*/}
                <Route path="/" element={<Main />} />
                {/* <Route path="/pageA" element={<PageA />} /> */}
                <Route path="/info" element={<Info />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Admin />} />
                {/* 상세페이지 */}
                <Route path="/semi/*" element={<Semi />}>
                    {/* 기본 페이지 리디렉션 */}
                    <Route index element={<Navigate to="mention" replace />} />
                    <Route path="mention" element={<MentionPage />} />
                    <Route path="company" element={<CompanyInfo />} />
                    <Route path="reputation" element={<Reputation />} />
                    <Route path="association" element={<AssociationPage />} />
                    <Route path="comparekeyword" element={<CompareKeyword/>}/>
                </Route>
                {/* 구독관련 */}
                <Route path="/subscription" element={<SubscriptionPlans />} />
                <Route path="/subscription/manage" element={<ProtectedSubscriptionManagement />} />
                {/*관리자페이지*/}
                <Route path='/admin/users' element={<ProtectedAdminUserPage />} />
            </Routes>
            <Footer />
        </>
    )
}

export default AppRouter