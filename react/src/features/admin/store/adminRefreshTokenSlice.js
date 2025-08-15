import {createSlice} from '@reduxjs/toolkit'
import { deleteRefreshTokenByEmailThunk, deleteRefreshTokenByPatternThunk, fetchRefreshTokenListThunk } from './adminRefreshTokenThunk'


const initialState = {
    list: [],
    loading: false,
    error: null,
    successMessage: null,
    filters: {pattern: 'rt:user:*', limit: 100, scanCount: 1000},
}

const adminRefreshTokenSlice = createSlice({
    name: 'adminRefreshToken',
    initialState,
    reducers: {
        setFilter(state, action) {
            state.filters = { ...state.filters, ...(action.payload || {})}
        },
        clearAdminRefreshTokenState(state) {
            state.error = null
            state.successMessage = null
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchRefreshTokenListThunk.pending, (state) => {
            state.loading = true
            state.error = null
            state.successMessage = null
        })
        .addCase(fetchRefreshTokenListThunk.fulfilled, (state, action) => {
            state.loading = false
            state.list = action.payload || []
        })
        .addCase(fetchRefreshTokenListThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'RT 목록 조회 실패'
        })
        
        .addCase(deleteRefreshTokenByEmailThunk.fulfilled, (state, action) => {
            state.successMessage = `Deleted ${action.meta.arg}`
        })
        .addCase(deleteRefreshTokenByEmailThunk.rejected, (state, action)=>{
            state.error = action.payload || 'RT 단건 삭제 실패'
        })

        .addCase(deleteRefreshTokenByPatternThunk.fulfilled, (state, action) => {
            state.successMessage = `Deleted by pattern: ${action.meta.arg}`
        })
        .addCase(deleteRefreshTokenByPatternThunk.rejected, (state, action) => {
            state.error = action.payload || 'RT 패턴 삭제 실패'
        })
    }
})

export const { setFilter, clearAdminRefreshTokenState} = adminRefreshTokenSlice.actions
export default adminRefreshTokenSlice.reducer