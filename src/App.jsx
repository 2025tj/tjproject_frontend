import { useEffect } from 'react'
import AppRouter from '@app/router/AppRouter'
import './App.css'
import React, { useState } from "react";
import { Route, Routes, Navigate, useNavigate, useLocation, BrowserRouter } from 'react-router-dom'

import Footer from './Routes/Footer';
import { fetchCompaniesByName, setSearchTerm, fetchCompaniesByType } from './redux/reducerSlices/companySearchSlice';
import { Radio } from 'antd';
import ChatBot from './ChatBot'
import {GlobalAlert} from '@shared/components/layout'
import { useDispatch, useSelector } from 'react-redux'
import { logoutThunk, restoreUserThunk } from './features/auth/store/authThunk'
import { useAuthInit } from './features/auth/hooks/useAuthInit'
import Loading from './features/auth/components/Loading'
import { setAuthErrorHandler } from './shared/utils/api/client'
// import './CSS/Header.css'

const App = () => {
	useAuthInit()
	  // const { loading } = useSelector(state => state.auth)
	  
	  // 콜백 등록 (1회)
	  // useEffect(() => {
	  //   setAuthErrorHandler(() => {
	  //     dispatch(logoutThunk())
	  //     navigate('/login')
	  //   })
	  // }, [dispatch, navigate])
	
	  // if (loading) {
	  //   return <Loading />
	  // }
  





  return (
    <>
    	<GlobalAlert />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      
      
      
      
    </>
  );
};

export default App
