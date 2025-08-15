// src/components/Header.js
import Logo from "../images/Logo.jpg";
import "../CSS/Header.css"

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Login from "./Login"
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../features/auth/store/authThunk";

const Header = ({  toRegister, handleNavigation, SearchBar }) => {
  // const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  
  const [LoginModal, setLoginModal]= useState(false)

  const navigate = useNavigate()

  const handleLogout = async () => {
          try {
              await dispatch(logoutThunk()).unwrap()
              navigate('/login')
          } catch (err) {
              console.error('로그아웃 요청 실패:', err)
          }
      }

      const isAdmin = user?.roles?.includes('ROLE_ADMIN')

  // const toLogin= {()=> setLoginModal(true)}
  return (
    // <header className="w-full border-b shadow-sm">
    // <div className="max-w-7xl mx-auto px-4">
    //   <div className="flex justify-between items-center h-16">
    <>
      <header className="header-container">
        <div className="header-inner">
          {/* <nav className="flex items-center space-x-8 ">
            <ul className="flex space-x-6"> */}
          <nav className="nav-left">
            <ul className="flex space-x-6">
              <li>
                <img
                  src={Logo}
                  alt="NewsEmo Logo"
                  style={{ width: "120px", height: "auto", display: "flex", cursor: "pointer" }}
                  // className="-pointer"
                  onClick={() => navigate("/")}
                />
              </li>
              {/* <li><Link to="/semi/mention" onClick={() => handleNavigation("semi")}>상세</Link></li> */}
              {isAuthenticated && (
                <>
                {isAdmin && (
                  <>
                  {/* 둘중 아무거나? */}
                    <li><Link to="/Admin" onClick={() => handleNavigation("Admin")}>관리자</Link></li>
                    {/* <li><Link to='/admin/dashboard'>관리자 대시보드</Link></li> */}
                  </>
                )}
                <li><Link to="/mypage">마이페이지</Link></li>
                </>
              )}
            </ul>

                  
              <div className="auth-buttons">
                <div className="modal-contetn">

                  {isAuthenticated ? (
                    <>
                      <button onClick={handleLogout}>로그아웃</button>
                    </>   
                  ) : (
                    <>
                      <button onClick={()=>setLoginModal(true)}>로그인</button>
                      {/* Login에서 전달한 props 받아서 사용 */}
                      <Login open={LoginModal} onclose={()=> setLoginModal(false)}></Login>
                      <button onClick={toRegister}>회원가입</button>
                    </>
                    
                  )}
                  
                </div>
              </div>

            {/* {LoginModal && (
            <div className="modal-backdrop">
              <Login/>
              <button onClick={()=>setLoginModal(false)}> 로그인창닫기</button>
            </div>
            )} */}
          </nav>

          {/* <div className="absolute top-4 right-8 flex items-center space-x-4"> */}
          {/* <div className=" ml-auto flex items-center space-x-4"> */}
        </div>



        {SearchBar && (<div> <SearchBar onSearch />
        </div>
        )}
        {/* </div> */}
        {/* <CompanyRanking/> */}
      </header>

    </>
  );
};

export default Header;
