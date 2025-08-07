import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const API_URL = "http://localhost:8000/api/companies/search/"; //회사정보
const REVIEW_API_URL = "http://localhost:8000/api/reviews/create/"; //리뷰

//✅회사 정보 불러오기
export const fetchCompanies = createAsyncThunk( 
  "company/fetchCompanies",
  async (companyName, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}?name=${encodeURIComponent(companyName)}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("회사 데이터를 불러오는 중 오류 발생:", error);
      return rejectWithValue(error.response?.data || "Unknown error");
    }
  }
);

//✅리뷰 보내기
export const submitReview = createAsyncThunk(
  "company/submitReview",
  async ({ companyName, userId, isAnonymous, content, timestamp }, { rejectWithValue }) => {
    try {
      const payload = {
        company_name: companyName,
        user_id: isAnonymous ? "익명" : userId,
        content,
        timestamp,
      };
      const response = await axios.post(REVIEW_API_URL, payload);
      return response.data;
    } catch (error) {
      console.error("리뷰 작성 중 오류 발생:", error);
      return rejectWithValue(error.response?.data || "Unknown error");
    }
  }
);

//✅리뷰 목록 불러오기
export const fetchReviews = createAsyncThunk(
  "company/fetchReviews",
  async ({ companyName }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/reviews/?company_name=${encodeURIComponent(companyName)}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "리뷰 불러오기 실패");
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState: {
    companies: [],          
    searchInfo: {           
      search_type: '',
      search_keyword: '',
      total_count: 0
    },
    status: "idle", 
    error: null,
    companyName: '',

    reviewStatus: 'idle',
    reviewError: null,
    reviewMessage: '',
    
    reviews: [],
    currentPage: 1,
    hasNextPage: true,
  },
  reducers: {
    setCompanyName: (state, action) => {
      state.companyName = action.payload;
    },
    setCompanyData: (state, action) => {
      if (action.payload.companies) {
        state.companies = action.payload.companies;
        state.searchInfo = {
          search_type: action.payload.search_type,
          search_keyword: action.payload.search_keyword,
          total_count: action.payload.total_count
        };
      } else {
        state.companies = Array.isArray(action.payload) ? action.payload : [action.payload];
      }
      state.status = 'succeeded';
    },
  },
  extraReducers: (builder) => {
    builder
      //✅회사 정보 불러오기
      .addCase(fetchCompanies.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = "succeeded";
        
        // Django API 응답 구조 파싱
        const responseData = action.payload;
        state.companies = responseData.companies || [];
        state.searchInfo = {
          search_type: responseData.search_type || '',
          search_keyword: responseData.search_keyword || '',
          total_count: responseData.total_count || 0
        };
        
        if (state.companies.length === 0) {
          state.error = "검색 결과가 없습니다.";
        }
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "데이터 요청 실패";
      })
      //✅리뷰 보내기
      // .addCase(submitReview.pending, (state) => {
      //   state.reviewStatus = "loading";
      // })
      // .addCase(submitReview.fulfilled, (state, action) => {
      //   state.reviewStatus = "succeeded";
      //   state.reviewMessage = action.payload.message || "리뷰가 성공적으로 저장되었습니다.";
      // })
      // .addCase(submitReview.rejected, (state, action) => {
      //   state.reviewStatus = "failed";
      //   state.reviewError = action.payload || "리뷰 저장 실패";
      // })
      // //✅리뷰 불러오기
      // .addCase(fetchReviews.pending, (state) => {
      //   state.reviewStatus = "loading";
      // })
      // .addCase(fetchReviews.fulfilled, (state, action) => {
      //   const { results, next } = action.payload;
      //   state.reviews.push(...results); // 누적
      //   state.reviewStatus = "succeeded";
      //   state.currentPage += 1;
      //   state.hasNextPage = Boolean(next);
      // })
      // .addCase(fetchReviews.rejected, (state, action) => {
      //   state.reviewStatus = "failed";
      //   state.reviewError = action.payload;
      // })
      ;
    },
  });

export const { setCompanyName, setCompanyData } = companySlice.actions;
export default companySlice.reducer;
