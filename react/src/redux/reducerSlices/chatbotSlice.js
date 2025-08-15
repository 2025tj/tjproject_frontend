// 해결 방안 1: 챗봇 전용 slice 생성 (추천)
// chatbotSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/api/chatbot/search/company";

export const fetchCompaniesForChatbot = createAsyncThunk(
  "chatbot/fetchCompanies", // 다른 액션 타입
  async (searchTerm) => {
    try {
      console.log("검색어", searchTerm)
      const response = await axios.get(`${API_URL}?company_name=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      console.error("챗봇 회사 검색 오류:", error);
      throw error;
    }
  }
);

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState: {
    companies: [],
    searchStatus: "idle",
    searchTerm: "",
    // selectedCompany: null, // 상세 페이지용
  },
  reducers: {
    setChatbotSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedCompany: (state, action) => {
      state.selectedCompany = action.payload;
    },
    clearChatbotSearch: (state) => {
      state.companies = [];
      state.searchStatus = "idle";
      state.searchTerm = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompaniesForChatbot.pending, (state) => {
        state.searchStatus = "loading";
      })
      .addCase(fetchCompaniesForChatbot.fulfilled, (state, action) => {
        state.searchStatus = "succeeded";
        state.companies = action.payload.companies;
      })
      .addCase(fetchCompaniesForChatbot.rejected, (state) => {
        state.searchStatus = "failed";
      });
  },
});

export default chatbotSlice.reducer;
export const { setChatbotSearchTerm, setSelectedCompany, clearChatbotSearch } = chatbotSlice.actions;
