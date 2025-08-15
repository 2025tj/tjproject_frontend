import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = "http://localhost:8000/api/analyzeNews/filter";

// 기간 설정 매핑
const PERIOD_PRESETS = [
  { label: "1일", value: "date1-7" },
  { label: "1주", value: "date1-2" },
  { label: "1개월", value: "date1-3" },
];

// 감정분석 데이터 가져오기
export const fetchReputationAnalysis = createAsyncThunk(
  "reputation/fetchAnalysis",
  async ({ keyword, periodLabel = "date1-7", model = "vote", maxArticles = 500 }, { rejectWithValue }) => {
    try {
      const payload = {
        keyword,
        unified_category: [],
        incident_category: [],
        date_method: "preset",
        period_label: periodLabel,
        headless: true,
        max_articles: Number(maxArticles),
        model,
      };

      console.log("🚀 감정분석 API 요청:", {
        url: API_URL,
        payload: payload
      });

      const response = await axios.post(API_URL, payload);
      
      console.log(response.data,"+++++++++++++++++++++++++++++++++++++++++++++++++++")
      console.log("✅ 감정분석 API 응답:", {
        status: response.status,
        data: response.data
      });


      // 빈 결과 처리
      const isEmpty =
        response.status === 204 ||
        !response.data ||
        response.data.count === 0 ||
        (Array.isArray(response.data.results) && response.data.results.length === 0);

      if (isEmpty) {
        return rejectWithValue("검색 결과가 없습니다. 조건을 넓혀 다시 시도해주세요.");
      }

      return response.data;
    } catch (error) {
      console.error("🔥 감정분석 API 오류:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });

      if (error.response?.status === 204) {
        console.log("📭 빈 결과 응답 (204)");
        return rejectWithValue("검색 결과가 없습니다. 조건을 넓혀 다시 시도해주세요.");
      }

      if (error.response?.data?.detail) {
        console.log("⚠️ 서버 에러:", error.response.data.detail);
        return rejectWithValue("서버 오류: " + error.response.data.detail);
      }

      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log("🌐 네트워크 연결 오류");
        return rejectWithValue("백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.");
      }

      return rejectWithValue("네트워크 오류 또는 예기치 않은 문제 발생: " + error.message);
    }
  }
);

const reputationSlice = createSlice({
  name: 'reputation',
  initialState: {
    // 분석 결과 데이터
    analysisData: null,
    totalCount: 0,
    
    // 감정별 통계
    emotionStats: {
      positive: 0,
      negative: 0,
      neutral: 0,
    },
    
    // 가장 높은 감정 타입과 비율
    dominantEmotion: {
      type: null,
      count: 0,
      percentage: 0,
      confidence: 0,
    },
    
    // 전체 평균 신뢰도
    averageConfidence: 0,
    
    // 현재 설정
    currentSettings: {
      keyword: '',
      periodLabel: 'date1-7',
      model: 'vote',
      maxArticles: 500,
    },
    
    // 기간별 캐시된 결과
    periodResults: {
      'date1-7': null,
      'date1-2': null,
      'date1-3': null,
    },
    
    // 상태 관리
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    currentPeriod: 'date1-7',
  },
  reducers: {
    // 현재 기간 설정
    setCurrentPeriod: (state, action) => {
      state.currentPeriod = action.payload;
      // 캐시된 결과가 있으면 바로 적용
      const cachedResult = state.periodResults[action.payload];
      if (cachedResult) {
        state.analysisData = cachedResult;
        state.totalCount = cachedResult.count || 0;
        updateEmotionStats(state, cachedResult);
      }
    },
    
    // 설정 업데이트
    updateSettings: (state, action) => {
      state.currentSettings = { ...state.currentSettings, ...action.payload };
    },
    
    // 결과 초기화
    clearResults: (state) => {
      state.analysisData = null;
      state.totalCount = 0;
      state.emotionStats = { positive: 0, negative: 0, neutral: 0 };
      state.dominantEmotion = { type: null, count: 0, percentage: 0, confidence: 0 };
      state.averageConfidence = 0;
      state.error = null;
    },
    
    // 기간별 결과 캐시 초기화
    clearPeriodResults: (state) => {
      state.periodResults = {
        'date1-7': null,
        'date1-2': null,
        'date1-3': null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // 감정분석 요청 시작
      .addCase(fetchReputationAnalysis.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // 감정분석 성공
      .addCase(fetchReputationAnalysis.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.analysisData = action.payload;
        state.totalCount = action.payload.count || 0;
        
        // 현재 기간 결과 캐시
        state.periodResults[state.currentPeriod] = action.payload;
        
        // 감정별 통계 계산
        updateEmotionStats(state, action.payload);
      })
      // 감정분석 실패
      .addCase(fetchReputationAnalysis.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || '분석에 실패했습니다.';
        state.analysisData = null;
        state.totalCount = 0;
        state.emotionStats = { positive: 0, negative: 0, neutral: 0 };
        state.dominantEmotion = { type: null, count: 0, percentage: 0, confidence: 0 };
        state.averageConfidence = 0;
      });
  },
});

// 감정별 통계 계산 헬퍼 함수
function updateEmotionStats(state, data) {
  if (!data?.results || !Array.isArray(data.results)) {
    state.emotionStats = { positive: 0, negative: 0, neutral: 0 };
    state.dominantEmotion = { type: null, count: 0, percentage: 0, confidence: 0 };
    state.averageConfidence = 0;
    return;
  }

  // 감정별 개수 계산 및 신뢰도 수집
  const stats = { positive: 0, negative: 0, neutral: 0 };
  const confidenceByType = { positive: [], negative: [], neutral: [] };

  data.results.forEach((item) => {
    const confidence = item.confidence || 0;
    switch (item.label) {
      case '긍정':
        stats.positive += 1;
        confidenceByType.positive.push(confidence);
        break;
      case '부정':
        stats.negative += 1;
        confidenceByType.negative.push(confidence);
        break;
      case '중립':
        stats.neutral += 1;
        confidenceByType.neutral.push(confidence);
        break;
      default:
        break;
    }
  });

  state.emotionStats = stats;

  // 전체 평균 신뢰도 계산
  const allConfidences = [...confidenceByType.positive, ...confidenceByType.negative, ...confidenceByType.neutral];
  const averageConfidence = allConfidences.length > 0 
    ? (allConfidences.reduce((sum, conf) => sum + conf, 0) / allConfidences.length * 100).toFixed(1)
    : 0;
  
  state.averageConfidence = parseFloat(averageConfidence);

  // 가장 높은 감정 타입 찾기
  const emotions = [
    { 
      type: '긍정', 
      count: stats.positive,
      averageConfidence: confidenceByType.positive.length > 0 
        ? (confidenceByType.positive.reduce((sum, conf) => sum + conf, 0) / confidenceByType.positive.length * 100).toFixed(1)
        : 0
    },
    { 
      type: '부정', 
      count: stats.negative,
      averageConfidence: confidenceByType.negative.length > 0 
        ? (confidenceByType.negative.reduce((sum, conf) => sum + conf, 0) / confidenceByType.negative.length * 100).toFixed(1)
        : 0
    },
    { 
      type: '중립', 
      count: stats.neutral,
      averageConfidence: confidenceByType.neutral.length > 0 
        ? (confidenceByType.neutral.reduce((sum, conf) => sum + conf, 0) / confidenceByType.neutral.length * 100).toFixed(1)
        : 0
    },
  ];

  const dominant = emotions.reduce((max, current) => 
    current.count > max.count ? current : max
  );

  const total = stats.positive + stats.negative + stats.neutral;
  const percentage = total > 0 ? ((dominant.count / total) * 100).toFixed(1) : 0;

  state.dominantEmotion = {
    type: dominant.type,
    count: dominant.count,
    percentage: parseFloat(percentage),
    confidence: parseFloat(dominant.averageConfidence),
  };
}

export const { 
  setCurrentPeriod, 
  updateSettings, 
  clearResults, 
  clearPeriodResults 
} = reputationSlice.actions;

export default reputationSlice.reducer;
