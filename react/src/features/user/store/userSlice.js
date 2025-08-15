import { createSlice } from '@reduxjs/toolkit'
import { fetchUserProfileThunk, updateUserInfoThunk, withdrawThunk } from './userThunk'

const initialState = {
  profile: null,
  loading: false,
  error: null,
  withdrawing: false,
  withdrawError: null,
  withdrawSuccessMessage: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducres: {
    clearWithdraw(state) {
      state.withdrawError = null
      state.withdrawSuccessMessage = null
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchProfile
      .addCase(fetchUserProfileThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProfileThunk.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
      })
      .addCase(fetchUserProfileThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // updateInfo
      .addCase(updateUserInfoThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserInfoThunk.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
      })
      .addCase(updateUserInfoThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(withdrawThunk.pending, (state) => {
        state.withdrawing = true
        state.withdrawError = null
        state.withdrawSuccessMessage = null
      })
      .addCase(withdrawThunk.fulfilled, (state, action) => {
        state.withdrawing = false
        state.withdrawSuccessMessage = action.payload?.message || '탈퇴 처리되었습니다.'
        state.profile = null
      })
      .addCase(withdrawThunk.rejected, (state, action) => {
        state.withdrawing = false
        state.withdrawError = action.payload || '탈퇴 처리중 오류가 발생했습니다.'
      })
  }
})

export const { clearUserState } = userSlice.actions
export default userSlice.reducer
//   reducers: {
//     setUserProfile(state, action) {
//       state.profile = action.payload
//     },
//     setUserLoading(state, action) {
//       state.loading = action.payload
//     },
//     setUserError(state, action) {
//       state.error = action.payload
//     },
//     clearUserState(state) {
//       state.profile = null
//       state.loading = false
//       state.error = null
//     },
//   },
// })

// export const {
//   setUserProfile,
//   setUserLoading,
//   setUserError,
//   clearUserState,
// } = userSlice.actions