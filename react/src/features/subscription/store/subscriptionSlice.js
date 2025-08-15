import { createSlice, TaskAbortError } from "@reduxjs/toolkit";
import { cancelSubThunk, checkSubStatThunk, createRefundRequestThunk, createSubThunk, fetchSubDetailsThunk, refundThunk, unSubNowThunk } from "./subscriptionThunk";

/**
 * @typedef {import('./subscriptionTypes').subscriptionDetails} SubDetails
 */
const initialState = {
    // 구독상태
    isActive: false,
    /** @type {SubDetails|null} */
    subscriptionDetails: null,

    //로딩상태
    loading: false,
    createLoading: false, // 구독생성중 로딩
    detailsLoading: false, // 구독조회중 로딩

    //에러 상태
    error: null,
    createError: null, // 구독생성중 에러

    //성공메세지
    successMessage: null,
}

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
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
        },
        setSubscriptionActive: (state, action) => {
            state.isActive = true
            state.subscriptionDetails = action.payload
            state.successMessage = '구독이 활성화되었습니다.'
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
                console.log('🟢 checkSubStatThunk.fulfilled payload:', action.payload)
                state.loading = false
                state.isActive = action.payload?.isActive ?? false
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
            // .addCase(fetchSubDetailsThunk.fulfilled, (state, action) => {
            //     console.log('🟢 fetchSubDetailsThunk.fulfilled payload:', action.payload)
            //     state.detailsLoading = false
            //     state.subscriptionDetails = action.payload
            //     state.isActive = action.payload?.active || false
            // })
            // .addCase(fetchSubDetailsThunk.rejected, (state, action) => {
            //     state.detailsLoading = false
            //     state.error = action.payload?.message || '구독 정보 조회에 실패했습니다.'
            //     state.subscriptionDetails = null
            // })
            .addCase(fetchSubDetailsThunk.fulfilled, (state, action) => {
                console.log('🟢 fetchSubDetailsThunk.fulfilled payload:', action.payload.data)
                state.detailsLoading = false
                state.subscriptionDetails = action.payload.data?.details || null
                state.isActive = action.payload.data?.status === 'ACTIVE'
            })
            .addCase(fetchSubDetailsThunk.rejected, (state, action) => {
                state.detailsLoading = false
                state.error = action.payload.data?.message || '구독 정보 조회에 실패했습니다.'
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

            //환불
            .addCase(refundThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(refundThunk.fulfilled, (state, action) => {
                state.loading = false
                state.subscriptionDetails = action.payload.data?.details || null
                state.isActive = action.payload.data?.status === 'ACTIVE'
                state.successMessage = action.payload?.message || '구독이 해지 및 환불되었습니다.'
            })
            .addCase(refundThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || '구독 해지에 실패했습니다.'
            })

            .addCase(createRefundRequestThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createRefundRequestThunk.fulfilled, (state, action) => {
                state.loading = false
                state.successMessage = '환불 요청이 접수되었습니다. 관리자가 승인 후 처리됩니다.'
                if (state.subscriptionDetails) {
                    state.subscriptionDetails.status = 'CANCELLED'
                }
                state.isActive = false
            })
            .addCase(createRefundRequestThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message || '환불 요청에 실패했습니다.'
            })
    }
})

export const { clearError, clearSuccessMessage, resetSubscriptionState, setSubscriptionActive } = subscriptionSlice.actions
export default subscriptionSlice.reducer