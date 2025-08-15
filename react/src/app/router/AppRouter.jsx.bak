import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Home from "../../features/dashboard/HomePage";
import LoginPage from "../../features/auth/pages/LoginPage";
import OAuth2Redirect from "../../features/auth/pages/OAuth2Redirect";
import PrivateRoute from "./PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import MyPage from "../../features/user/pages/MyPage";
import EmailVerify from "../../features/email/pages/EmailVerify";
// import Header from '../../shared/components/layout/Header'
import SignupPage from "../../features/auth/pages/SignupPage";
// import SocialLinkPage from '@features/auth/pages/SocialLinkPage'
// import OAuth2LinkRedirect from '../../features/auth/pages/OAuth2LinkRedirect'
// import OAuth2SignupRedirect from '../../features/auth/pages/OAuth2SignupRedirect'
import OAuth2LinkComplete from "../../features/auth/components/OAuth2LinkComplete";
import PasswordResetRequestPage from "../../features/auth/pages/PasswordResetRequestPage";
import PasswordResetPage from "../../features/auth/pages/PasswordResetPage";
import {
  withAdminGuard,
  withAuthGuard,
} from "../../features/auth/components/withAuthGuard";
import AuthRedirectHandler from "../../shared/utils/api/AuthRedirectHandler";
// -------------------------------------------------------------------------
// 관리자 페이지
import Admin from "../../Admin";
import Inquiries from "../../ASide/Inquiries";
import Members from "../../ASide/Members";

import Main from "../../Routes/Start";
// import PageA from "./Routes/PageA";
import Info from "../../Routes/Info";
import Semi from "../../Routes/Semi";
import Register from "../../Routes/Register";
import CompanyInfo from "../../pages/CompanyInfo";
import CompanyReview from "../../pages/CompanyReview";
import MentionPage from "../../pages/MentionPage";
import Reputation from "../../pages/Reputation";
import AssociationPage from "../../pages/AssociationPage";
import CompareKeyword from "../../pages/CompareKeyword";
// import MyPage from './pages/MyPage';
import Header from "../../Routes/Header";
import Footer from "../../Routes/Footer";
import React, { useState } from "react";
import {
  fetchCompaniesByName,
  fetchCompaniesByType,
  setSearchTerm,
} from "../../redux/reducerSlices/companySearchSlice";
import Chatbot from "../../ChatBot";
import SubscriptionManagement from "../../features/subscription/pages/SubscriptionManagement";
import SubscriptionPlans from "../../features/subscription/pages/SubscriptionPlans";
import Subscribe from "../../pages/Subscribe";

import "../../App.css";
import AdminUserPage from "../../features/admin/pages/AdminUserPage";
import AdminDashboard from "../../features/admin/pages/AdminDashboard";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import AdminRefundPage from "../../features/admin/pages/AdminRefundPage";
import AdminRefreshTokenPage from "../../features/admin/pages/AdminRefreshTokensPage";
// SearchBar 정의 부분

const AppRouter = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // 페이지에 인증요구하도록
  const ProtectedMyPage = withAuthGuard(MyPage);
  const ProtectedSubscriptionManagement = withAuthGuard(SubscriptionManagement);

  const [currentPage, setCurrentPage] = useState("");

  // const [loading, setLoading] = useState(false);
  // const [company, setCompany] = useState([]);
  const [searchTerm, setSearchTerms] = useState("");
  const [searchType, setSearchType] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // const toLogin = () => {
  //   navigate("/Login");
  // };

  const toRegister = () => {
    navigate("/signup");
  };

  const handleNavigation = (page) => {
    dispatch(setCurrentPage(page));
  };

  //  const handleSearch = (e) => {
  //   e.preventDefault()
  //   if (!searchTerm.trim()) return;
  //   // dispatch(fetchCompaniesByName(inputValue));
  // };

  return (
    <>
      <AuthRedirectHandler />
      <Header
        toRegister={toRegister}
        handleNavigation={handleNavigation}
       
        // Content={Content}
      />

      <main className="min-h bg-slate-200 w-[92%] ml-[4%] px-4 sm:px-6 lg:px-4 py-3 flex-grow">
        <Chatbot />
        <Routes>
          <Route path="/" element={<Main />} />

          {/* 마이페이지 - 인증 필요 */}
          <Route path="/mypage" element={<ProtectedMyPage />} />

          {/* 구독페이지 */}
          <Route path="/subscribe" element={<Subscribe />} />

          {/* 로그인 - 이미 로그인된 경우 홈으로 리다이렉트 */}
          <Route
            path="/"
            element={
              !isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />
            }
          />

          {/* 회원가입 */}
          <Route path="/signup" element={<SignupPage />} />

          {/* OAuth2 관련 */}
          <Route path="/oauth2/login" element={<OAuth2Redirect />} />
          <Route
            path="/oauth2/link-complete"
            element={<OAuth2LinkComplete />}
          />

          {/* 이메일 인증 */}
          <Route path="/email/verify" element={<EmailVerify />} />

          {/* 🆕 비밀번호 재설정 관련 */}
          <Route
            path="/auth/password-reset-request"
            element={
              !isAuthenticated ? (
                <PasswordResetRequestPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/auth/password-reset"
            element={
              !isAuthenticated ? (
                <PasswordResetPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* 기타 리다이렉트나 404 처리 */}
          <Route path="*" element={<Navigate to="/" replace />} />

          {/*------------------------------*/}
          <Route path="/" element={<Main />} />
          <Route path="/info" element={<Info />} />

          <Route path="/register" element={<Register />} />
          {/* <Route path="/admin" element={<Admin />} >
                    <Route path='inquiries' element={<Inquiries/>}></Route>
                    <Route path='members' element={<Members/>}></Route>
                </Route> */}
          {/* <Route path="/admin" element={<Admin />} /> */}
          {/* 상세페이지 */}
          <Route path="/semi/*" element={<Semi />}>
            {/* 기본 페이지 리디렉션 */}
            <Route index element={<Navigate to="mention" replace />} />
            <Route path="mention" element={<MentionPage />} />
            <Route path="company" element={<CompanyInfo />} />
            <Route path="companyreview" element={<CompanyReview />} />
            <Route path="reputation" element={<Reputation />} />
            <Route path="association" element={<AssociationPage />} />
            <Route path="comparekeyword" element={<CompareKeyword />} />
          </Route>
          {/* 구독관련 */}
          <Route path="/subscription" element={<SubscriptionPlans />} />
          <Route
            path="/subscription/manage"
            element={<ProtectedSubscriptionManagement />}
          />
          {/*관리자페이지*/}
          {/* <Route path='/admin/users' element={<ProtectedAdminUserPage />} /> */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<Admin />}>
              <Route path="inquiries" element={<Inquiries />}></Route>
              <Route path="members" element={<Members />}></Route>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUserPage />} />
                <Route path="refunds" element={<AdminRefundPage />} />
                <Route
                path="/admin/refresh-tokens"
                element={<AdminRefreshTokenPage />}/>
            </Route>
          </Route>
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default AppRouter;
