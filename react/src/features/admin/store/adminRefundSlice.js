import { createSlice } from "@reduxjs/toolkit";
import { approveRefundThunk, fetchRefundRequestsThunk } from "./adminRefundThunk";

const initialState = {
    list: [],
    loading: false,
    error : null,
    successMessage: null,
}
const adminRefundSlice = createSlice({
    name: 'adminRefunds',
    initialState,
    reducers: {
        clearAdminRefundState: (state) => {
            state.error = null
            state.successMessage = null
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchRefundRequestsThunk.pending, (state) => {
            state.loading = true
            state.error =null
        })
        .addCase(fetchRefundRequestsThunk.fulfilled, (state, action) => {
            console.log('fetchREfundRequestsThunk.fulfilled : action.payload', action.payload)
            state.loading = false
            state.list = action.payload
        })
        .addCase(fetchRefundRequestsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || '환불 요청 목록 조회 실패'
        })

        .addCase(approveRefundThunk.fulfilled, (state, action) => {
            state.successMessage = action.payload?.message || '환불 승인 완료'
            state.list = state.list.map((req) => 
                req.id === action.payload.data?.id ? action.payload.data : req
            )
        })
        .addCase(approveRefundThunk.rejected, (state, action) => {
            state.error = action.payload || '환불 승인 실패'
        })
    }
})
export const {clearAdminRefundState } = adminRefundSlice.actions
export default adminRefundSlice.reducer