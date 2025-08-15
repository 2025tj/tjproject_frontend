import React, { useEffect } from "react";
import { Card, Spin, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchReputationAnalysis, setCurrentPeriod } from "../redux/reducerSlices/reputationSlice";

const ReputationCard = ({ onCalculateSummary }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const companyName = searchParams.get('company') || '';
  
  // Redux 상태
  const { 
    emotionStats, 
    dominantEmotion, 
    totalCount, 
    status, 
    error, 
    currentPeriod,
    averageConfidence 
  } = useSelector(state => state.reputation);

  const tabs = [
    { id: 'date1-7', label: '1일' },
    { id: 'date1-2', label: '1주' },
    { id: 'date1-3', label: '1달' },
  ];

  // 기간별 최대 기사 수 설정
  const getMaxArticlesByPeriod = (periodId) => {
    switch (periodId) {
      case 'date1-7': // 1일
        return 50;
      case 'date1-2': // 1주
        return 200;
      case 'date1-3': // 1달
        return 500;
      default:
        return 100;
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (companyName && companyName.trim() !== '') {
      console.log("🎯 ReputationCard 데이터 로드 시작:", {
        companyName,
        currentPeriod,
        maxArticles: getMaxArticlesByPeriod(currentPeriod),
        timestamp: new Date().toISOString()
      });
      
      dispatch(fetchReputationAnalysis({
        keyword: companyName,
        periodLabel: currentPeriod,
        model: 'vote',
        maxArticles: getMaxArticlesByPeriod(currentPeriod)
      }));
    } else {
      console.log("⚠️ 회사명이 없어서 데이터 로드를 건너뜁니다:", { companyName });
    }
  }, [dispatch, companyName, currentPeriod]);

  // 상위 컴포넌트에 요약 데이터 전달
  useEffect(() => {
    if (dominantEmotion.type && dominantEmotion.percentage > 0) {
      onCalculateSummary?.({ 
        maxType: dominantEmotion.type, 
        maxPercentage: dominantEmotion.percentage 
      });
    }
  }, [dominantEmotion, onCalculateSummary]);

  // 탭 변경 핸들러
  const handleTabChange = (periodId) => {
    console.log("📅 탭 변경:", { from: currentPeriod, to: periodId, companyName });
    
    dispatch(setCurrentPeriod(periodId));
    
    // 새로운 기간의 데이터가 없으면 API 호출
    if (companyName && companyName.trim() !== '') {
      console.log("🔄 새로운 기간 데이터 요청:", { 
        periodId, 
        companyName, 
        maxArticles: getMaxArticlesByPeriod(periodId) 
      });
      dispatch(fetchReputationAnalysis({
        keyword: companyName,
        periodLabel: periodId,
        model: 'vote',
        maxArticles: getMaxArticlesByPeriod(periodId)
      }));
    }
  };



  // 감정 타입별 색상
  const emotionColors = {
    '긍정': '#52c41a',
    '부정': '#ff4d4f',
    '중립': '#faad14'
  };

  // 로딩 상태
  if (status === 'loading') {
    return (
      <Card
        title="감정 분석"
        style={{
          width: "100%",
          maxWidth: 750,
          borderRadius: "20px",
        }}
        extra={
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-full">
            {tabs.map((tab) => {
              const isActive = currentPeriod === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  disabled={status === 'loading'}
                  className={`relative rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2`}
                  style={{
                    color: isActive ? 'white' : 'black', 
                    WebkitTapHighlightColor: 'transparent',
                    zIndex: 1,
                    backgroundColor: isActive ? '#582D1D' : 'transparent',
                    opacity: status === 'loading' ? 0.5 : 1,
                  }}
                >
                  <span style={{ position: 'relative', zIndex: 2 }}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        }
      >
        <div style={{ 
          width: "100%", 
          height: "400px",
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '16px'
        }}>
          <Spin size="large" />
          <span style={{ color: '#666', fontSize: '16px' }}>감정 분석 중...</span>
        </div>
      </Card>
    );
  }

  // 에러 상태
  if (status === 'failed' || error) {
    return (
      <Card
        title="감정 분석"
        style={{
          width: "100%",
          maxWidth: 750,
          borderRadius: "20px",
        }}
        extra={
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-full">
            {tabs.map((tab) => {
              const isActive = currentPeriod === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2`}
                  style={{
                    color: isActive ? 'white' : 'black', 
                    WebkitTapHighlightColor: 'transparent',
                    zIndex: 1,
                    backgroundColor: isActive ? '#582D1D' : 'transparent',
                  }}
                >
                  <span style={{ position: 'relative', zIndex: 2 }}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        }
      >
        <div style={{ 
          width: "100%", 
          height: "400px",
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
        }}>
          <Alert
            message="분석 실패"
            description={error || "감정 분석에 실패했습니다."}
            type="error"
            showIcon
          />
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={`감정 분석 (${companyName || '회사명 없음'})`}
      style={{
        width: "100%",
        maxWidth: 750,
        borderRadius: "20px",
      }}
      extra={
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-full">
          {tabs.map((tab) => {
            const isActive = currentPeriod === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2`}
                style={{
                  color: isActive ? 'white' : 'black', 
                  WebkitTapHighlightColor: 'transparent',
                  zIndex: 1,
                  backgroundColor: isActive ? '#582D1D' : 'transparent',
                }}
              >
                <span style={{ position: 'relative', zIndex: 2 }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      }
    >
      <div style={{ 
        width: "100%", 
        minHeight: "400px",
        padding: "32px 24px",
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px'
      }}>
        {totalCount === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '300px',
            color: '#666',
            fontSize: '16px'
          }}>
            <span>분석할 기사가 없습니다.</span>
            <span style={{ fontSize: '14px', marginTop: '8px' }}>
              다른 기간을 선택해보세요.
            </span>
          </div>
        ) : (
          <>
            {/* 가장 높은 감정 타입 크게 표시 */}
            <div style={{
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: emotionColors[dominantEmotion.type] || '#666',
                marginBottom: '8px'
              }}>
                {dominantEmotion.type}
              </div>
              <div style={{
                fontSize: '18px',
                color: '#666'
              }}>
                {dominantEmotion.percentage}% ({dominantEmotion.count}건)
              </div>
              {dominantEmotion.confidence > 0 && (
                <div style={{
                  fontSize: '14px',
                  color: '#999',
                  marginTop: '4px'
                }}>
                  신뢰도: {dominantEmotion.confidence}%
                </div>
              )}
            </div>

            {/* 감정별 기사 개수 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px',
              width: '100%',
              maxWidth: '600px'
            }}>
              <div style={{
                flex: 1,
                textAlign: 'center',
                padding: '20px 16px',
                borderRadius: '12px',
                backgroundColor: '#f6ffed',
                border: '1px solid #b7eb8f'
              }}>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: emotionColors['긍정'],
                  marginBottom: '8px'
                }}>
                  {emotionStats.positive}
                </div>
                <div style={{
                  fontSize: '15px',
                  color: '#666',
                  fontWeight: '500'
                }}>
                  긍정 기사
                </div>
              </div>

              <div style={{
                flex: 1,
                textAlign: 'center',
                padding: '20px 16px',
                borderRadius: '12px',
                backgroundColor: '#fff2e8',
                border: '1px solid #ffd591'
              }}>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: emotionColors['중립'],
                  marginBottom: '8px'
                }}>
                  {emotionStats.neutral}
                </div>
                <div style={{
                  fontSize: '15px',
                  color: '#666',
                  fontWeight: '500'
                }}>
                  중립 기사
                </div>
              </div>

              <div style={{
                flex: 1,
                textAlign: 'center',
                padding: '20px 16px',
                borderRadius: '12px',
                backgroundColor: '#fff2f0',
                border: '1px solid #ffb3b3'
              }}>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: emotionColors['부정'],
                  marginBottom: '8px'
                }}>
                  {emotionStats.negative}
                </div>
                <div style={{
                  fontSize: '15px',
                  color: '#666',
                  fontWeight: '500'
                }}>
                  부정 기사
                </div>
              </div>
            </div>

            {/* 총 기사 수 및 평균 신뢰도 */}
            <div style={{
              textAlign: 'center',
              marginTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{
                fontSize: '16px',
                color: '#666'
              }}>
                총 {totalCount}건의 기사 분석
              </div>
              {averageConfidence > 0 && (
                <div style={{
                  fontSize: '14px',
                  color: '#999'
                }}>
                  평균 신뢰도: {averageConfidence}%
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default ReputationCard;
