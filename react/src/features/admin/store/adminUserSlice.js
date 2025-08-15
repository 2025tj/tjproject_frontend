import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminUsersThunk } from "./adminUserThunk";

const adminUserSlice =createSlice({
    name: 'amdinUsers',
    initialState: {
        list: [],
        loading: false,
        error : null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchAdminUsersThunk.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(fetchAdminUsersThunk.fulfilled, (state, action)=> {
            state.loading = false
            state.list = action.payload
        })
        .addCase(fetchAdminUsersThunk.rejected, (state, action) => {
            state.loading =false
            state.error = action.payload
        })
    },
})

export default adminUserSlice.reducer