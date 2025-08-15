import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 비동기 thunk: 키워드 추출 API 호출
export const fetchKeywords = createAsyncThunk(
  'keyword/fetchKeywords',
  async (params, { rejectWithValue }) => {
    try {
      const payload = {
        keyword: params.keyword,
        date_method: "preset",
        period_label: params.periodLabel,
        headless: true,
        max_articles: params.maxArticles || null,
        method: params.method || "keybert",
        aggregate_from_individual: params.aggregateMode === "individual",
      };

      const response = await axios.post("http://localhost:8000/api/news/keywords", payload);
      
      if (!response.data || response.data.count === 0) {
        throw new Error("검색 결과가 없습니다. 조건을 넓혀 다시 시도해주세요.");
      }
      
      return {
        ...response.data,
        params: params // 요청 파라미터도 함께 저장
      };
    } catch (error) {
      const message = error.response?.data?.detail || error.message;
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  // 현재 분석 상태
  loading: false,
  error: null,
  
  // 현재 설정
  currentKeyword: "",
  currentPeriod: "date1-7", // 1일
  currentMethod: "tfidf",
  currentMaxArticles: 10,
  currentAggregateMode: "summary",
  
  // 결과 데이터 (기간별로 캐시)
  results: {
    "date1-7": null,  // 1일
    "date1-2": null,  // 1주  
    "date1-3": null,  // 1개월
  },
  
  // 현재 결과
  currentResult: null,
};

const keywordSlice = createSlice({
  name: 'keyword',
  initialState,
  reducers: {
    setCurrentKeyword: (state, action) => {
      state.currentKeyword = action.payload;
    },
    setCurrentPeriod: (state, action) => {
      state.currentPeriod = action.payload;
      // 해당 기간의 캐시된 결과가 있으면 설정
      if (state.results[action.payload]) {
        state.currentResult = state.results[action.payload];
      }
    },
    setCurrentMethod: (state, action) => {
      state.currentMethod = action.payload;
    },
    setCurrentMaxArticles: (state, action) => {
      state.currentMaxArticles = action.payload;
    },
    setCurrentAggregateMode: (state, action) => {
      state.currentAggregateMode = action.payload;
    },
    clearResults: (state) => {
      state.results = {
        "date1-7": null,
        "date1-2": null,
        "date1-3": null,
      };
      state.currentResult = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKeywords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKeywords.fulfilled, (state, action) => {
        state.loading = false;
        const { params, ...result } = action.payload;
        
        // 결과를 기간별로 캐시
        state.results[params.periodLabel] = result;
        state.currentResult = result;
        
        // 현재 설정 업데이트
        state.currentKeyword = params.keyword;
        state.currentPeriod = params.periodLabel;
        state.currentMethod = params.method;
        state.currentMaxArticles = params.maxArticles;
        state.currentAggregateMode = params.aggregateMode;
      })
      .addCase(fetchKeywords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentResult = null;
      });
  }
});

export const {
  setCurrentKeyword,
  setCurrentPeriod,
  setCurrentMethod,
  setCurrentMaxArticles,
  setCurrentAggregateMode,
  clearResults,
  clearError
} = keywordSlice.actions;

export default keywordSlice.reducer;