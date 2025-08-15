import {createAsyncThunk as thunk} from '@reduxjs/toolkit'
import { adminRefreshTokenService as rtService } from '../service/adminRefreshService'
import { rt } from 'framer-motion/client'

export const fetchRefreshTokenListThunk = thunk(
    'adminRefreshToken/fetch',
    async (params, { rejectWithValue}) => {
        try {
            const data = await rtService.fetchListService(params)
            return data
        } catch (err) {
            return rejectWithValue(err.response?.data || 'RT 목록 조회 실패')
        }
    }
)

export const deleteRefreshTokenByEmailThunk = thunk(
    'adminRefreshToken/deleteOne',
    async (email, {dispatch, getState, rejectWithValue}) => {
        try {
            await rtService.deleteOneService(email)
            //삭제 후 재조회
            const {filters} = getState().adminRefreshToken
            await dispatch(fetchRefreshTokenListThunk(filters))
            return { email }
        } catch (err) {
            return rejectWithValue(err.response?.data || 'RT 단건 삭제 실패')
        }
    }
)

export const deleteRefreshTokenByPatternThunk = thunk(
    'adminRefreshToken/deleteByPattern',
    async (pattern, {dispatch, getState, rejectWithValue}) => {
        try {
            await rtService.deleteByPatternService(pattern)
            const {filters} = getState().adminRefreshToken
            await dispatch(fetchRefreshTokenListThunk(filters))
            return { pattern}
        } catch (err) {
            return rejectWithValue(err.response?.data || 'RT 패턴 삭제 실패')
        }
    }
)