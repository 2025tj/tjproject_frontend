import { createSlice } from '@reduxjs/toolkit'
import { fetchUserProfileThunk, updateUserInfoThunk } from './userThunk'

const initialState = {
  profile: null,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
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