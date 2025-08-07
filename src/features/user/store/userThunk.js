import { createAsyncThunk } from '@reduxjs/toolkit'
import { userService } from '../services/userService'
// import {
//   setUserProfile,
//   setUserLoading,
//   setUserError,
// } from './userSlice'

export const fetchUserProfileThunk = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getProfile()
    } catch (err) {
      return rejectWithValue(err.message || '사용자 정보 조회 실패')
    }
  }
)
// export const fetchUserProfileThunk = createAsyncThunk(
//   'user/fetchProfile',
//   async (_, { dispatch, rejectWithValue }) => {
//     try {
//       dispatch(setUserLoading(true))
//       const profile = await userService.getProfile()
//       dispatch(setUserProfile(profile))
//       return profile
//     } catch (err) {
//       dispatch(setUserError(err.message || '사용자 정보 조회 실패'))
//       return rejectWithValue(err.message)
//     } finally {
//       dispatch(setUserLoading(false))
//     }
//   }
// )

export const updateUserInfoThunk = createAsyncThunk(
  'user/updateInfo',
  async (updateData, { rejectWithValue }) => {
    try {
      return await userService.updateUserInfo(updateData)
    } catch (err) {
      return rejectWithValue(err.message || '회원 정보 수정 실패')
    }
  }
)
// export const updateUserInfoThunk = createAsyncThunk(
//   'user/updateInfo',
//   async (updateData, { dispatch, rejectWithValue }) => {
//     try {
//       dispatch(setUserLoading(true))
//       const updated = await userService.updateUserInfo(updateData)
//       dispatch(setUserProfile(updated)) // 성공 시 갱신
//       return updated
//     } catch (err) {
//       dispatch(setUserError(err.message))
//       return rejectWithValue(err.message)
//     } finally {
//       dispatch(setUserLoading(false))
//     }
//   }
// )