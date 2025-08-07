import { createSlice } from "@reduxjs/toolkit";
import { cancelSubThunk, checkSubStatThunk, createSubThunk, fetchSubDetailsThunk, unSubNowThunk } from "./subscriptionThunk";

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState: {
        // 구독 상태
        isActive: false,
        subscriptionDetails: null,

        // 로딩 상태
        loading: false,
        createLoading: false,
        detailsLoading: false,

        // 에러 상태
        error: null,
        createError: null,

        // 성공 메세지
        successMessage: null,
    },
    reducers: {
        clearError: (state) => {
            state.err = null
            state.createError = null
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null
        },
        resetSubscriptionState: (state) => {
            state.isActive = false
            state.subscriptionDetails = null
            state.error = null
            state.createError = null
            state.successMessage = null
        }
    },
    extraReducers: (builder) => {
        builder
            // 구독 생성
            .addCase(createSubThunk.pending, (state, action) => {
                state.createLoading = true
                state.createError = null
                state.successMessage = null
            })
            .addCase(createSubThunk.fulfilled, (state, action) => {
                state.createLoading = false
                state.isActive = true
                state.successMessage = '구독이 성공적으로 생성되었습니다.'
            })
            .addCase(createSubThunk.rejected, (state, action) => {
                state.createLoading = false
                state.createError = action.payload?.message || '구독 생성에 실패했습니다.'
            })

            // 구독 상태 확인
            .addCase(checkSubStatThunk.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(checkSubStatThunk.fulfilled, (state, action) => {
                state.loading = false
                state.isActive = true
            })
            .addCase(checkSubStatThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || '구독 상태 확인에 실패했습니다.'
                state.isActive = false
            })

            // 구독 상세 정보 조회
            .addCase(fetchSubDetailsThunk.pending, (state, action) => {
                state.detailsLoading = true
                state.error = null
            })
            .addCase(fetchSubDetailsThunk.fulfilled, (state, action) => {
                state.detailsLoading = true
                state.subscriptionDetails = action.payload
                state.isActive = action.payload?.isActive || false
            })
            .addCase(fetchSubDetailsThunk.rejected, (state, action) => {
                state.detailsLoading = false
                state.error = action.payload?.message || '구독 정보 조회에 실패했습니다.'
                state.subscriptionDetails = null
            })

            // 구독 해지 예약
            .addCase(cancelSubThunk.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(cancelSubThunk.fulfilled, (state, action) => {
                state.loading = false
                state.successMessage = '구독 해지 요청이 완료되었습니다. 만료일까지는 사용 가능합니다.'
                // 구독 상세 정보 업데이트
                if (state.subscriptionDetails) {
                    state.subscriptionDetails.status = 'CANCELLED'
                }
            })
            .addCase(cancelSubThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || '구독 해지에 실패했습니다.'
            })

            // 구독 즉시 해지
            .addCase(unSubNowThunk.pending, (state, action) => {
                state.loading = true
                state.error = null
            })
            .addCase(unSubNowThunk.fulfilled, (state, action) => {
                state.loading = false
                state.isActive = false
                state.subscriptionDetails = null
                state.successMessage = '구독이 즉시 해지되었습니다.'
            })
            .addCase(unSubNowThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || '구독 해지에 실패했습니다.'
            })
    }
})

export const { clearError, clearSuccessMessage, resetSubscriptionState } = subscriptionSlice.actions
export default subscriptionSlice.reducer