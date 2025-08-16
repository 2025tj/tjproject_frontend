import React, { useEffect, useState } from "react";
import { Card, Table, Tag } from "antd";
import cloud from "d3-cloud";
import * as d3 from "d3";
import { motion, LayoutGroup } from "framer-motion";
import "../CSS/tabButton.css"; // 탭 스타일 재사용

const wordData = [
  { keyword: "기대", type: "긍정", count: 7346 },
  { keyword: "강세", type: "긍정", count: 4408 },
  { keyword: "우려", type: "부정", count: 1338 },
  { keyword: "긍정적", type: "긍정", count: 1079 },
  { keyword: "호조", type: "긍정", count: 911 },
  { keyword: "1위", type: "긍정", count: 823 },
  { keyword: "급등하다", type: "중립", count: 784 },
  { keyword: "최고", type: "긍정", count: 763 },
  { keyword: "급락", type: "부정", count: 741 },
  { keyword: "선호", type: "긍정", count: 567 },
  { keyword: "화해", type: "긍정", count: 864 },
  { keyword: "비판하다", type: "부정", count: 1081 },
  { keyword: "영향력", type: "중립", count: 1578 },
];

const typeColor = {
  긍정: "#5845ea",
  부정: "#f53933",
  중립: "#fbc400",
};

const columns = [
  {
    title: "단어",
    dataIndex: "keyword",
    key: "keyword",
  },
  {
    title: "긍·부정",
    dataIndex: "type",
    key: "type",
    render: (type) => <Tag color={typeColor[type]}>{type}</Tag>,
  },
  {
    title: "건수",
    dataIndex: "count",
    key: "count",
    align: "right",
  },
];

const ReputationCard = ({ onCalculateSummary }) => {
  const [viewMode, setViewMode] = useState("cloud");
  const svgRef = React.useRef();

  const tabs = [
    { id: "cloud", label: "워드맵" },
    { id: "table", label: "순위표" },
  ];

  useEffect(() => {
    const typeTotals = wordData.reduce(
      (acc, item) => {
        acc[item.type] += item.count;
        return acc;
      },
      { 긍정: 0, 부정: 0, 중립: 0 }
    );

    const totalCount = typeTotals.긍정 + typeTotals.부정 + typeTotals.중립;
    const entries = Object.entries(typeTotals);
    const [maxType, maxTypeCount] = entries.reduce((a, b) => (a[1] > b[1] ? a : b));
    const maxPercentage = ((maxTypeCount / totalCount) * 100).toFixed(1);
    onCalculateSummary?.({ maxType, maxPercentage });
  }, [onCalculateSummary]);

  const cloudData = wordData.map((item) => ({
    text: item.keyword,
    value: item.count,
    type: item.type,
  }));

  useEffect(() => {
    if (viewMode !== "cloud") return;
    // 워드클라우드 레이아웃 생성
    const layout = cloud()
      .size([700, 400])
      .words(cloudData.map(d => ({ ...d, size: 12 + (d.value / 1000) * 14 })))
      .padding(5)
      .rotate(() => 0)
      .font("Pretendard")
      .fontSize(d => d.size)
      .on("end", draw);
    layout.start();
    function draw(words) {
      const width = 700;
      const height = 600;
      const svg = d3.select(svgRef.current);
      svg.selectAll("g").remove();

      svg
        .attr("width", "100%") 
        .attr("height", "100%")
        .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`) 
        .attr("preserveAspectRatio", "xMidYMid meet");

      svg
        .append("g")
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d) => `${d.size}px`)
        .style("font-family", "Pretendard")
        .style("fill", (d) => typeColor[d.type])
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text((d) => d.text)
        .append("title")
        .text((d) => `${d.text}: ${d.value.toLocaleString()}건`);
    }

  }, [viewMode, cloudData]);

  return (
    <Card
      title="긍 · 부정"
      style={{
        width: "100%",
        maxWidth: 750,
        borderRadius: "20px",
        body: { padding: 0 }
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
      {viewMode === "cloud" ? (
        <div style={{ width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg ref={svgRef}></svg>
        </div>
      ) : (
        <div style={{ maxHeight: 430, overflowY: "auto" }}>
          <Table
            columns={columns}
            dataSource={wordData}
            pagination={false}
            rowKey="keyword"
            size="small"
          />
        </div>
      )}
    </Card>
  );
};

export default ReputationCard;
