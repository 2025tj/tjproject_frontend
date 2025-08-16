import React, { useState } from "react";
import { Card } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { ResponsiveTreeMap } from "@nivo/treemap";
import axios from "axios";
import { setSelectedKeywordNews } from "../redux/reducerSlices/associationSlice";
import { motion, LayoutGroup } from 'framer-motion';

const AssociationMapCard = ({ height }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const companyName = searchParams.get("company") || "";
  const [viewMode, setViewMode] = useState('day');

  const centerKeyword = useSelector((state) => state.association.centerKeyword);
  const relatedKeywords = useSelector((state) => state.association.relatedKeywords);

  const tabs = [
    { id: 'day', label: '일별' },
    { id: 'week', label: '주별' },
    { id: 'month', label: '월별' },
  ];

  const colorPalette = [
    "#EC407A", "#4DB6AC", "#42A5F5", "#81C784",
    "#FFCA28", "#A5D6A7", "#EF5350", "#66BB6A",
    "#FF8A65", "#AB47BC", "#FFA726", "#66BB6A"
  ];

  const handleKeywordClick = async (keyword) => {
    if (!companyName || !keyword) return;
    try {
      const response = await axios.post("http://localhost:8000/api/news/company-keyword", {
        company_name: companyName,
        keyword: keyword,
      });

      dispatch(setSelectedKeywordNews({
        articles: response.data.articles,
        keyword: keyword,
      }));
    } catch (error) {
      console.error("키워드 뉴스 검색 실패:", error);
    }
  };

  // 값이 0인 키워드는 제외하고 트리맵 데이터 구성
  const validKeywords = relatedKeywords.filter(keyword => keyword.value > 0);
  
  const treeMapData = {
    name: centerKeyword,
    children: validKeywords.map((keyword, index) => ({
      name: keyword.name,
      loc: keyword.value,
      color: colorPalette[index % colorPalette.length],
    })),
  };

  // 빈 공간을 최소화하기 위해 데이터가 없을 때는 빈 객체 반환
  if (!relatedKeywords || relatedKeywords.length === 0 || validKeywords.length === 0) {
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
      >
        <div style={{ 
          height: "100%", 
          width: "100%", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: "#666"
        }}>
          연관어 데이터가 없습니다.
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
              const isActive = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={`relative rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2`}
                  style={{
                    color: isActive ? 'white' : 'black', 
                    WebkitTapHighlightColor: 'transparent',
                    zIndex: 1,
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="bubble"
                      className="absolute inset-0 z-0 mix-blend-normal"
                      style={{ 
                        borderRadius: 9999,
                        backgroundColor: '#582D1D'
                      }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 2 }}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      }
    >
      <div style={{ height: "100%", width: "100%" }}>
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
          onClick={(node) => {
            if (node.data.name !== centerKeyword) {
              handleKeywordClick(node.data.name);
            }
          }}
        />
      </div>
    </Card>
  );
};

export default AssociationMapCard;
