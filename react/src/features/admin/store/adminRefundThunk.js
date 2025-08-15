import { createAsyncThunk as thunk } from "@reduxjs/toolkit";
import {adminRefundService as refund} from '../service/adminRefundService'

export const fetchRefundRequestsThunk = thunk(
    'adminRefunds/fetch',
    async (_, {rejectWithValue}) => {
        try {
            const data= await refund.fetchRefundRequestsService()
            console.log('fetchRefundRequestsThunk: data', data)
            return data.data
        } catch (err) {
            return rejectWithValue(err.response?.data || '조회 실패')
        }
    }
)

export const approveRefundThunk = thunk(
    'adminRefunds/approve',
    async ({id, amount}, {rejectWithValue}) => {
        try {
            const data = await refund.approveRefundService(id, amount)
            return data.data
        } catch (err) {
            return rejectWithValue(err.response?.data || '승인 실패')
        }
    }
)