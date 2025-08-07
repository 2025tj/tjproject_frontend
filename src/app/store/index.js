import { configureStore } from '@reduxjs/toolkit'
import React from 'react'
import authReducer from '@features/auth/store/authSlice'
import userReducer from '@features/user/store/userSlice'

const store = configureStore ({
    reducer: {
        auth: authReducer,
        user: userReducer
    }
})

export default store

