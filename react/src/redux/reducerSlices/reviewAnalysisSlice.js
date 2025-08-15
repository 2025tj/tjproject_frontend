import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const REVIEW_ANALYSIS_API_URL = "http://localhost:8000/api/review/analyze";

// 리뷰 분석 불러오기
export const fetchReviewAnalysis = createAsyncThunk(
  "reviewAnalysis/fetchReviewAnalysis",
  async (companyName, { rejectWithValue }) => {
    try {
      const response = await axios.post(REVIEW_ANALYSIS_API_URL, {
        name: companyName
      });
      return response.data;
    } catch (error) {
      console.error("리뷰 분석 데이터를 불러오는 중 오류 발생:", error);
      return rejectWithValue(error.response?.data || "Unknown error");
    }
  }
);

const reviewAnalysisSlice = createSlice({
  name: 'reviewAnalysis',
  initialState: {
    analysisData: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearAnalysisData: (state) => {
      state.analysisData = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewAnalysis.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchReviewAnalysis.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.analysisData = action.payload;
        state.error = null;
      })
      .addCase(fetchReviewAnalysis.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "리뷰 분석 요청 실패";
      });
  },
});

export const { clearAnalysisData } = reviewAnalysisSlice.actions;
export default reviewAnalysisSlice.reducer; 