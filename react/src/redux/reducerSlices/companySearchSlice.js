import { createSlice, createAsyncThunk } from "/node_modules/.vite/deps/@reduxjs_toolkit.js?v=27e8c257";
import axios from "/node_modules/.vite/deps/axios.js?v=27e8c257";

const API_URL = "http://localhost:8000/api/companies/search";

// ✅ createAsyncThunk로 비동기 액션 생성
export const fetchCompaniesByName = createAsyncThunk(
  "company/fetchCompanies",
  async (searchTerm) => {
    try {
      const response = await axios.get(`${API_URL}?name=${encodeURIComponent(searchTerm)}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("회사 데이터를 불러오는 중 오류 발생:", error);
      throw error;
    }
  }
);
// 산업 분야  별 검색
export const fetchCompaniesByType = createAsyncThunk(
  "company/fetchByType",
  async (type) => {
    try {
      const response = await axios.get(`${API_URL}?category=${encodeURIComponent(type)}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("회사 분야 검색 중 오류:", error);
      throw error;
    }
  }
);

const companySearchSlice = createSlice({
  name: 'companySearch',
  initialState: {
    list: [],
    status: "idle",
    searchTerm: "",
    searchType: "",
    total: 0,
    keyword: ""
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSearchType: ( state, action)=>{
      state.searchType= action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompaniesByName.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompaniesByName.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.companies;
        state.total= action.payload.total_count
        state.keyword= action.payload.search_keyword
      })
      .addCase(fetchCompaniesByName.rejected, (state) => {
        state.status = "failed";
      })
        //  분야 검색 추가
      .addCase(fetchCompaniesByType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompaniesByType.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.companies;
        state.total= action.payload.total_count
        state.keyword= action.payload.search_keyword   //검색어
         })
      .addCase(fetchCompaniesByType.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default companySearchSlice.reducer;
export const { setSearchTerm, setSearchType } = companySearchSlice.actions;