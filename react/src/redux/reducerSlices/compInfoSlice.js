import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = "http://localhost:8000/api/companies/search";

//  thunk
export const fetchInfo = createAsyncThunk(
  'info/fetchInfo',
  async (id) => {
    const response = await axios.get(`/${API_URL}/info/${id}`);
    return response.data;
  }
);

const compInfoSlice = createSlice({
  name: 'info',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default compInfoSlice.reducer;
