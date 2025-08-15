import React from "react";
import { Card } from "antd";
import ReactECharts from "echarts-for-react";

const CompareKeyword = ({ height = 600 }) => {
  const leftData = {
    centerKeyword: "엔비디아",
    relatedKeywords: [
      { name: "미국", value: 1282 },
      { name: "시장", value: 711 },
      { name: "달러", value: 1398 },
      { name: "반도체", value: 845 },
      { name: "AI", value: 1304 },
      { name: "트럼프", value: 944 },
      { name: "한국", value: 1176 },
      { name: "주식", value: 678 },
      { name: "관세", value: 1059 },
      { name: "투자", value: 1409 },
      { name: "주가", value: 899 },
      { name: "금리", value: 1293 },
      { name: "삼성전자", value: 763 },
      { name: "기업", value: 1222 },
      { name: "증시", value: 1090 },
    ],
  };

  const rightData = {
    centerKeyword: "테슬라",
    relatedKeywords: [
      { name: "미국" },
      { name: "시장" },
      { name: "차량" },
      { name: "중국" },
      { name: "투자" },
      { name: "모델" },
      { name: "엔비디아" },
      { name: "트럼프" },
      { name: "전기차" },
      { name: "기업" },
      { name: "관세" },
      { name: "한국" },
    ],
  };

  const colorPalette = ["#FFC75A", "#62C796", "#95B3E1", "#FF4A6F"];
  const keywordMap = new Map();
  const displayNameMap = new Map(); // ✅ label로 보여줄 이름 따로 저장

  const reservedNames = new Set([leftData.centerKeyword, rightData.centerKeyword]);

  const addToMap = (keyword, source, value = 800) => {
    if (!keyword) return;
    const isConflict = reservedNames.has(keyword);
    const uniqueName = isConflict && source === rightData.centerKeyword
      ? `${keyword}-from-${source}` // ✅ 이름 중복 회피
      : keyword;

    if (keywordMap.has(uniqueName)) {
      const existing = keywordMap.get(uniqueName);
      existing.sources.add(source);
      existing.value = Math.max(existing.value, value);
    } else {
      keywordMap.set(uniqueName, {
        name: uniqueName,
        value,
        sources: new Set([source]),
      });
      displayNameMap.set(uniqueName, keyword); // ✅ 원래 이름 저장
    }
  };

  leftData.relatedKeywords.forEach((kw) => {
    if (kw.name) addToMap(kw.name, leftData.centerKeyword, kw.value);
  });

  rightData.relatedKeywords.forEach((kw) => {
    if (kw.name) addToMap(kw.name, rightData.centerKeyword);
  });

  const nodes = [
    {
      name: leftData.centerKeyword,
      symbolSize: 100,
      itemStyle: { color: "#101011ff" },
      label: { fontSize: 18 },
      x: 300,
      y: height / 2,
      fixed: true,
    },
    {
      name: rightData.centerKeyword,
      symbolSize: 100,
      itemStyle: { color: "#101011ff" },
      label: { fontSize: 18 },
      x: 600,
      y: height / 2,
      fixed: true,
    },
    ...Array.from(keywordMap.values())
      .filter((kw) => kw.name !== leftData.centerKeyword && kw.name !== rightData.centerKeyword)
      .map((kw) => {
        const isShared = kw.sources.size > 1;
        return {
          name: kw.name,
          value: kw.value,
          symbolSize: 50,
          itemStyle: {
            color: isShared
              ? "#FF9A3C"
              : colorPalette[Math.floor(Math.random() * colorPalette.length)],
            borderColor: isShared ? "#ff0000" : undefined,
            borderWidth: isShared ? 3 : 1,
          },
          label: {
            fontSize: 14,
            formatter: displayNameMap.get(kw.name) || kw.name, // ✅ 실제 이름 표시
          },
        };
      }),
  ];

  const links = [];
  keywordMap.forEach((kw) => {
    kw.sources.forEach((source) => {
      links.push({ source, target: kw.name });
    });
  });

  const option = {
    tooltip: {
      formatter: (params) => {
        if (params.dataType === "edge") return "";
        const name = params.data.name;
        if (!name) return "";
        const display = displayNameMap.get(name) || name;
        const kw = keywordMap.get(name);
        const sources = kw ? Array.from(kw.sources).join(", ") : "N/A";
        return `<b>${display}</b><br/>연관: ${sources}<br/>언급량: ${kw?.value || "N/A"}건`;
      },
    },
    series: [
      {
        type: "graph",
        layout: "force",
        roam: true,
        force: {
          repulsion: 500,
          edgeLength: [100, 200],
          gravity: 0.01,
        },
        label: {
          show: true,
          color: "#fff",
          fontWeight: "bold",
        },
        data: nodes,
        links: links,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FBF7F4] p-1">
      <Card
        title={`공통 연관어 그래프`}
        style={{ borderRadius: 20 }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ height }}>
          <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
        </div>
      </Card>
    </div>
  );
};

export default CompareKeyword;
