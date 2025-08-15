import { createAsyncThunk as thunk } from "@reduxjs/toolkit";
import { adminUserService as admin, } from "../service/adminUserService";

export const fetchAdminUsersThunk = thunk(
    'adminUsers/fetchAll',
    async (_, {rejectWithValue}) => {
        try {
            return await admin.getUsersService()
        } catch (err) {
            return rejectWithValue(err.message || '사용자 조회 실패')
        }
    }
)

export const changeUserStatusThunk = thunk(
    'adminUsers/changeStatus',
    async ({id, action}, {dispatch, rejectWithValue}) => {
        try {
            await admin.changeStatusService(id, action)
            dispatch(fetchAdminUsersThunk())
        } catch (err) {
            return rejectWithValue(err.message || '상태변경 실패')
        }
    }
)