import React from "react";
import { Card } from "antd";
import ReactECharts from "echarts-for-react";
import { useSelector } from "react-redux";

const AssociationMapCard = ({ height }) => {
  const centerKeyword = useSelector((state) => state.association.centerKeyword);
  const relatedKeywords = useSelector((state) => state.association.relatedKeywords);
  const colorPalette = ["#FF9A3C", "#FFC75A", "#62C796", "#95B3E1", "#FF4A6F"];

  const rawNodes = [
    {
      name: centerKeyword,
      symbolSize: 100,
      itemStyle: { color: "#101011ff" },
      label: { fontSize: 20 },
    },
    ...relatedKeywords.map((keyword) => ({
      name: keyword.name,
      value: keyword.value,
      symbol: "path://M10,0 H90 C95,0 100,5 100,10 V20 C100,25 95,30 90,30 H10 C5,30 0,25 0,20 V10 C0,5 5,0 10,0 Z",
      symbolSize: [100, 30],
      itemStyle: {
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      },
      label: { fontSize: 16 },
    })),
  ];

  const nodes = Array.from(new Map(rawNodes.map((node) => [node.name, node])).values());

  const links = relatedKeywords
    .filter((keyword) => keyword.name !== centerKeyword)
    .map((keyword) => ({
      source: centerKeyword,
      target: keyword.name,
    }));

  const option = {
    tooltip: {
      formatter: function (params) {
        if (params.dataType === "edge") return "";
        if (params.data.name === centerKeyword) return "";
        return `${params.data.name}: ${params.data.value?.toLocaleString() || 'N/A'}건`;
      },
    },
    series: [
      {
        type: "graph",
        layout: "force",
        roam: true,
        force: { repulsion: 700, edgeLength: 100 },
        label: {
          show: true,
          color: "#ffffff",
          fontWeight: "bold",
        },
        data: nodes,
        links: links,
      },
    ],
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
      }}
    >
      <div style={{ height }}>
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </Card>
  );
};

export default AssociationMapCard;
