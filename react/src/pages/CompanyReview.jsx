import { Liquid } from '@ant-design/plots';
import { useSearchParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviewAnalysis, clearAnalysisData } from '../redux/reducerSlices/reviewAnalysisSlice';
import { Spin, Alert, Card, Row, Col, Typography, Divider } from 'antd';

const { Title, Text, Paragraph } = Typography;

const CompanyReview = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const companyName = searchParams.get('company');
  
  const { analysisData, status, error } = useSelector((state) => state.reviewAnalysis);

  // 리뷰 분석 데이터 불러오기
  useEffect(() => {
    if (companyName) {
      dispatch(fetchReviewAnalysis(companyName));
    }
    
    // 컴포넌트 언마운트 시 데이터 초기화
    return () => {
      dispatch(clearAnalysisData());
    };
  }, [companyName, dispatch]);

  const config = {
    percent: 0.3,
    style: { outlineBorder: 4, outlineDistance: 8, waveLength: 128 },
    color: "#000",
    fontSize: 102,
    width: 180,
    height: 180,
    appendPadding: [0, 0, 0, 0],
    autoFit: false,
    containerStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
  
    // ✅ 중앙 % 텍스트를 검은색으로
    statistic: {
      title: false, // 중앙 위 타이틀 숨김(원하면 유지)
      content: {
        style: {
          color: '#000',   // 일부 버전은 'fill'을 씁니다. 둘 다 넣어도 OK
          fontSize: 52,
          fontWeight: 700,
          lineHeight: '22px',
          textAlign: 'center',
        },
        formatter: (v) => `${(v * 100).toFixed(1)}%`, // 표시 형식 원하는 대로
      },
    },
  };
  

  // 분석 데이터가 없을 때의 기본값
  const defaultSentiments = [
    { label: '긍정', percent: 0.6, color: '#52c41a' },
    { label: '부정', percent: 0.4, color: '#ff4d4f' },
  ];

  if (status === "loading") {
    return (
      <div className="p-6 bg-gray-50 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50">
        <Alert message="분석 오류" description={error} type="error" showIcon />
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="p-6 bg-gray-50">
        <Title level={2} className="text-center mb-6">
          {companyName} 리뷰 분석
        </Title>
        <div className="flex justify-center gap-12">
          {defaultSentiments.map(({ label, percent, color }, index) => (
            <Card key={index} className="w-80 text-center">
              <Title level={4}>{label}</Title>
              <div className="flex justify-center">
                <Liquid {...{ ...config, percent, color }} />
              </div>
              <div className="mt-2 text-sm text-black">
                {(percent * 100).toFixed(1)}%
              </div>
              <Text className="mt-4 block">분석 데이터 로딩 중...</Text>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 실제 분석 데이터 사용
  const { total_count, avg_score, pros, cons } = analysisData;
  
  // 긍정/부정 비율 계산 (중립 제거하고 긍정과 부정만 사용)
  const totalScore = (pros.avg_score || 0) + (cons.avg_score || 0);
  const positiveRatio = totalScore > 0 ? parseFloat(((pros.avg_score / totalScore) * 10).toFixed(1)) / 10 : 0.6;
  const negativeRatio = totalScore > 0 ? parseFloat(((cons.avg_score / totalScore) * 10).toFixed(1)) / 10 : 0.4;

  const sentiments = [
    { 
      label: '긍정 리뷰 분석', 
      percent: positiveRatio, 
      color: '#52c41a',
      keywords: pros.keywords || [],
      sampleReviews: pros.sample_reviews || []
    },
    { 
      label: '부정 리뷰 분석', 
      percent: negativeRatio, 
      color: '#ff4d4f',
      keywords: cons.keywords || [],
      sampleReviews: cons.sample_reviews || []
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDF8F4] py-10 px-4">
  <div className="max-w-6xl mx-auto">
    {/* 제목 */}
    <h2 className="text-3xl font-bold text-center text-black mb-10">
      {companyName} 리뷰 분석 결과
    </h2>

    {/* 통계 카드 */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="bg-white shadow-md rounded-2xl p-6 text-center">
        <h4 className="text-black mb-2 font-semibold">총 리뷰 수</h4>
        <p className="text-2xl font-bold text-gray-900">{total_count/2}개</p>
      </div>
      <div className="bg-white shadow-md rounded-2xl p-6 text-center">
        <h4 className="text-black mb-2 font-semibold">평균 만족도</h4>
        <p className="text-2xl font-bold text-gray-900">{avg_score.toFixed(1)}점</p>
      </div>
      <div className="bg-white shadow-md rounded-2xl p-6 text-center">
        <h4 className="text-black mb-2 font-semibold">분석 완료</h4>
        <p className="text-2xl font-bold text-green-500">✓</p>
      </div>
    </div>

    {/* Liquid 차트 퍼센트 표시 */}
    <div className="flex flex-col md:flex-row justify-center gap-6 mb-10 px-4 md:px-0">
  {sentiments.map(({ label, percent, color, keywords, sampleReviews }, index) => (
    <div key={index} className="bg-white shadow-md rounded-2xl p-6 w-full md:w-[440px]">
      <h4 className="text-lg font-semibold mb-4" style={{ color }}>{label}</h4>
      <div className="flex justify-center mb-4">
        <div className="w-36 h-36 flex justify-center items-center">
          <Liquid {...{ ...config, percent, color }} />
        </div>
      </div>

          {/* 키워드 */}
          {keywords.length > 0 && (
            <div className="mt-4 text-sm">
              <p className="font-medium text-gray-700">주요 키워드:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {keywords.map((kw, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                    {kw.keyword} ({kw.frequency})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 샘플 리뷰 */}
          {sampleReviews.length > 0 && (
            <div className="mt-4 text-sm">
              <p className="font-medium text-gray-700">대표 리뷰:</p>
              <div className="mt-2 space-y-2">
                {sampleReviews.map((review, i) => (
                  <p key={i} className="bg-gray-50 rounded p-2 text-gray-600 text-xs">"{review.review}"</p>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>

    
  </div>
</div>

  );
};

export default CompanyReview;
