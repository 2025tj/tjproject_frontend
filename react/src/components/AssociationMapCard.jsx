import React, { useEffect, useRef } from "react";
import { Card } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { ResponsiveTreeMap } from "@nivo/treemap";
import { fetchKeywords, setCurrentPeriod } from "../redux/reducerSlices/keywordSlice";
import { LayoutGroup } from 'framer-motion';

const AssociationMapCard = ({ height }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const companyName = searchParams.get("company") || "";
  
  // 중복 호출 방지를 위한 ref
  const lastRequestRef = useRef("");

  // URL의 company 파라미터를 centerKeyword로 사용
  const centerKeyword = companyName || "회사명 없음";
  
  // Redux 상태
  const relatedKeywords = useSelector((state) => state.association.relatedKeywords);
  const keywordState = useSelector((state) => state.keyword);
  const { currentPeriod, currentResult, loading, results } = keywordState;

  const tabs = [
    { id: 'date1-7', label: '1일' },
    { id: 'date1-2', label: '1주' },
    { id: 'date1-3', label: '1달' },
  ];

  // 키워드 값에 따라 파란색 밝기를 계산하는 함수 (값이 클수록 진하게)
  const calculateBlueColor = (value, maxValue, minValue) => {
    if (maxValue === minValue) return 'hsl(210, 100%, 35%)'; // 값이 모두 같으면 중간 밝기
    
    const range = maxValue - minValue;
    const normalizedValue = (value - minValue) / range;
    
    // 더 극명한 대비를 위해 지수 함수 사용 (상위 키워드를 더 진하게)
    const exponentialValue = Math.pow(normalizedValue, 0.5); // 제곱근으로 상위값 강조
    
    // 값이 클수록 진하게 (lightness 15%~85% 범위로 확대)
    const lightness = 85 - (exponentialValue * 70); // 85%에서 15%까지
    
    return `hsl(210, 100%, ${Math.round(lightness)}%)`;
  };

  // 탭 변경 시 키워드 데이터 가져오기
  const handleTabChange = async (periodLabel) => {
    dispatch(setCurrentPeriod(periodLabel));
    
    const requestKey = `${companyName}-${periodLabel}`;
    
    // 해당 기간의 캐시된 결과가 없고, 중복 요청이 아닐 때만 새로 요청
    if (
      !results[periodLabel] && 
      companyName && 
      companyName.trim() !== "" && 
      companyName !== "회사명 없음" && 
      !loading &&
      lastRequestRef.current !== requestKey
    ) {
      lastRequestRef.current = requestKey;
      dispatch(fetchKeywords({
        keyword: companyName,
        periodLabel: periodLabel,
        maxArticles: 0,
        method: "tfidf",
        aggregateMode: "summary"
      }));
    }
  };

  // companyName이 변경되면 현재 기간의 키워드 데이터 가져오기
  useEffect(() => {
    const requestKey = `${companyName}-${currentPeriod}`;
    
    // 조건을 더 엄격하게 체크하고 중복 요청 방지
    if (
      companyName && 
      companyName.trim() !== "" && 
      companyName !== "회사명 없음" && 
      !results[currentPeriod] && 
      !loading &&
      lastRequestRef.current !== requestKey
    ) {
      lastRequestRef.current = requestKey;
      dispatch(fetchKeywords({
        keyword: companyName,
        periodLabel: currentPeriod,
        maxArticles: 50,
        method: "tfidf", 
        aggregateMode: "summary"
      }));
    }
  }, [companyName, currentPeriod, dispatch, loading, results]);

  // 키워드 데이터 결정: API 결과가 있으면 사용, 없으면 기본 데이터 사용
  const displayKeywords = currentResult?.overall_keywords?.length > 0 
    ? currentResult.overall_keywords.map(kw => ({
        name: kw.keyword,
        value: parseInt(kw.count) || 0
      }))
    : relatedKeywords;

  // 값이 0인 키워드는 제외하고 트리맵 데이터 구성
  const validKeywords = displayKeywords.filter(keyword => keyword.value > 0);
  
  // 최대값과 최소값 계산
  const values = validKeywords.map(keyword => keyword.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  
  const treeMapData = {
    name: centerKeyword,
    children: validKeywords.map((keyword) => ({
      name: keyword.name,
      loc: keyword.value,
      color: calculateBlueColor(keyword.value, maxValue, minValue),
    })),
  };

  // 빈 공간을 최소화하기 위해 데이터가 없을 때는 빈 객체 반환
  if (!displayKeywords || displayKeywords.length === 0 || validKeywords.length === 0) {
    return (
      <Card
        title={`연관어 (${centerKeyword})`}
        style={{
          borderRadius: "20px",
          width: "100%",
          height,
        }}
        bodyStyle={{
          padding: 0,
          height: "calc(100% - 57px)",
        }}
        extra={
          <LayoutGroup>
            <div className="flex space-x-1 bg-gray-200 p-1 rounded-full">
              {tabs.map((tab) => {
                const isActive = currentPeriod === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    disabled={loading || centerKeyword === "회사명 없음"}
                    className={`relative rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2 ${
                      loading || centerKeyword === "회사명 없음" ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    style={{
                      color: isActive ? 'white' : 'black', 
                      WebkitTapHighlightColor: 'transparent',
                      zIndex: 1,
                      backgroundColor: isActive ? '#582D1D' : 'transparent',
                    }}
                  >
                    <span style={{ position: 'relative', zIndex: 2 }}>
                      {tab.label}
                      {loading && currentPeriod === tab.id && " ⏳"}
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        }
      >
        <div style={{ 
          height: "100%", 
          width: "100%", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: "#666"
        }}>
          {centerKeyword === "회사명 없음" 
            ? "URL에 회사명을 입력해주세요" 
            : loading 
              ? "키워드 분석 중..." 
              : "연관어 데이터가 없습니다."
          }
        </div>
      </Card>
    );
  }

  const getFontSize = (node) => {
    const area = node.width * node.height;
    if (area > 15000) return 18;
    if (area > 10000) return 16;
    if (area > 5000) return 14;
    if (area > 2000) return 12;
    return 10;
  };

  return (
    <Card
      title={`연관어 (${centerKeyword})`}
      style={{
        borderRadius: "20px",
        width: "100%",
        height,
      }}
      bodyStyle={{
        padding: 0,
        height: "calc(100% - 57px)",
      }}
      extra={
        <LayoutGroup>
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-full">
            {tabs.map((tab) => {
              const isActive = currentPeriod === tab.id;
              const hasData = results[tab.id] !== null;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  disabled={loading || centerKeyword === "회사명 없음"}
                  className={`relative rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2 ${
                    loading || centerKeyword === "회사명 없음" ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{
                    color: isActive ? 'white' : 'black', 
                    WebkitTapHighlightColor: 'transparent',
                    zIndex: 1,
                    backgroundColor: isActive ? '#582D1D' : 'transparent',
                  }}
                >
                  <span style={{ position: 'relative', zIndex: 2 }}>
                    {tab.label}
                    {loading && currentPeriod === tab.id && " ⏳"}
                    {hasData && !loading && " ✓"}
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      }
    >
      <div style={{ height: "100%", width: "100%" }}>
        {loading ? (
          <div style={{ 
            height: "100%", 
            width: "100%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            color: "#666"
          }}>
            키워드 분석 중...
          </div>
        ) : (
          <ResponsiveTreeMap
            data={treeMapData}
            identity="name"
            value="loc"
            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            enableParentLabel={false}
            enableLabels={true}
            label=""
            colors={(node) => node.data.color}
            borderColor="#ffffff"
            borderWidth={2}
            nodeOpacity={1}
            layout="squarify"
            tile="squarify"
            leavesOnly={true}
            animate={true}
            motionStiffness={90}
            motionDamping={11}
            nodeComponent={({ node, onClick }) => {
              const isCenter = node.data.name === centerKeyword;
              const fontSize = getFontSize(node);
              const label = node.data.name;
              const count = node.data.loc?.toLocaleString() + "건";

              return (
                <g transform={`translate(${node.x},${node.y})`} onClick={() => !isCenter && onClick(node)} style={{ cursor: !isCenter ? "pointer" : "default" }}>
                  <rect
                    width={node.width}
                    height={node.height}
                    fill={node.data.color}
                    stroke="#fff"
                    strokeWidth={2}
                    style={{ transition: "all 0.3s ease" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = 0.85;
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = 1;
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                  {node.width > 60 && node.height > 35 && (
                    <>
                      <text
                        x={node.width / 2}
                        y={node.height / 2 - 8}
                        fill="#fff"
                        fontSize={fontSize}
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="central"
                        pointerEvents="none"
                      >
                        {label}
                      </text>
                      <text
                        x={node.width / 2}
                        y={node.height / 2 + 10}
                        fill="#fff"
                        fontSize={fontSize - 2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        pointerEvents="none"
                      >
                        {count}
                      </text>
                    </>
                  )}
                </g>
              );
            }}
            
          />
        )}
      </div>
    </Card>
  );
};

export default AssociationMapCard;