import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const API_URL = "http://localhost:8000/api/companies/search"; //회사정보
const USER_REVIEW_API_URL = "http://localhost:8000/api/user_review"; //새로운 리뷰 API

//✅회사 정보 불러오기
export const fetchCompanies = createAsyncThunk( 
  "company/fetchCompanies",
  async (companyName, { rejectWithValue }) => {
    try {
      const url = `${API_URL}?name=${encodeURIComponent(companyName)}`;    
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("회사 데이터를 불러오는 중 오류 발생:", error);
      console.error("에러 응답:", error.response);
      return rejectWithValue(error.response?.data || "Unknown error");
    }
  }
);

//✅리뷰 보내기 (새로운 API)
export const submitReview = createAsyncThunk(
  "company/submitReview",
  async ({ companyId, content, parentId = null }, { rejectWithValue }) => {
    try {
      const payload = {
        companyId,
        content,
        parentId
      };
      const response = await axios.post(USER_REVIEW_API_URL, payload);
      return response.data;
    } catch (error) {
      console.error("리뷰 작성 중 오류 발생:", error);
      return rejectWithValue(error.response?.data || "Unknown error");
    }
  }
);

//✅리뷰 목록 불러오기 (새로운 API)
export const fetchReviews = createAsyncThunk(
  "company/fetchReviews",
  async ({ companyId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${USER_REVIEW_API_URL}/company/${companyId}`);
      console.log("리뷰 응답:", response.data);
      return response.data;
    } catch (error) {
      console.error("리뷰 불러오기 에러:", error);
      return rejectWithValue(error.response?.data || "리뷰 불러오기 실패");
    }
  }
);

//✅리뷰 수정
export const updateReview = createAsyncThunk(
  "company/updateReview",
  async ({ reviewId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${USER_REVIEW_API_URL}/${reviewId}`, {
        content
      });
      return response.data;
    } catch (error) {
      console.error("리뷰 수정 에러:", error);
      return rejectWithValue(error.response?.data || "리뷰 수정 실패");
    }
  }
);

//✅리뷰 삭제
export const deleteReview = createAsyncThunk(
  "company/deleteReview",
  async ({ reviewId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${USER_REVIEW_API_URL}/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error("리뷰 삭제 에러:", error);
      return rejectWithValue(error.response?.data || "리뷰 삭제 실패");
    }
  }
);

//✅리뷰 공감/취소
export const likeReview = createAsyncThunk(
  "company/likeReview",
  async ({ reviewId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${USER_REVIEW_API_URL}/${reviewId}/like`);
      return response.data;
    } catch (error) {
      console.error("리뷰 공감 에러:", error);
      return rejectWithValue(error.response?.data || "리뷰 공감 실패");
    }
  }
);

//✅대댓글 조회
export const fetchReplies = createAsyncThunk(
  "company/fetchReplies",
  async ({ parentId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${USER_REVIEW_API_URL}/${parentId}/replies`);
      return response.data;
    } catch (error) {
      console.error("대댓글 조회 에러:", error);
      return rejectWithValue(error.response?.data || "대댓글 조회 실패");
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
 
    reviewError: null,
    reviewMessage: '',
    
    reviews: [],
    totalReviews: 0,
    reviewStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
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
    clearReviews: (state) => {
      state.reviews = [];
      state.totalReviews = 0;
      state.reviewStatus = 'idle';
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
      .addCase(submitReview.pending, (state) => {
        state.reviewStatus = "loading";
      })
      .addCase(submitReview.fulfilled, (state) => {
        state.reviewStatus = "succeeded";
        // 리뷰 작성 성공 후 리뷰 목록 초기화
        state.reviews = [];
        state.totalReviews = 0;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.reviewStatus = "failed";
        state.reviewError = action.payload || "리뷰 저장 실패";
      })
      //✅리뷰 불러오기
      .addCase(fetchReviews.pending, (state) => {
        state.reviewStatus = "loading";
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        const { total, reviews } = action.payload;
        state.reviews = reviews;
        state.totalReviews = total;
        state.reviewStatus = "succeeded";
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.reviewStatus = "failed";
        state.reviewError = action.payload;
      })
      //✅리뷰 수정
      .addCase(updateReview.pending, (state) => {
        state.reviewStatus = "loading";
      })
      .addCase(updateReview.fulfilled, (state) => {
        state.reviewStatus = "succeeded";
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.reviewStatus = "failed";
        state.reviewError = action.payload || "리뷰 수정 실패";
      })
      //✅리뷰 삭제
      .addCase(deleteReview.pending, (state) => {
        state.reviewStatus = "loading";
      })
      .addCase(deleteReview.fulfilled, (state) => {
        state.reviewStatus = "succeeded";
        // 리뷰 삭제 후 목록 초기화
        state.reviews = [];
        state.totalReviews = 0;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.reviewStatus = "failed";
        state.reviewError = action.payload || "리뷰 삭제 실패";
      })
      //✅리뷰 공감
      .addCase(likeReview.pending, (state) => {
        state.reviewStatus = "loading";
      })
      .addCase(likeReview.fulfilled, (state) => {
        state.reviewStatus = "succeeded";
      })
      .addCase(likeReview.rejected, (state, action) => {
        state.reviewStatus = "failed";
        state.reviewError = action.payload || "공감 처리 실패";
      })
      ;
    },
  });

export const { setCompanyName, setCompanyData, clearReviews } = companySlice.actions;
export default companySlice.reducer;
