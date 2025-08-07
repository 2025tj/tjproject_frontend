import React, { useState, useMemo, useEffect } from 'react';
import { Card } from 'antd';
import { Line } from '@ant-design/plots';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { motion, LayoutGroup } from 'framer-motion';
import '../CSS/tabButton.css';

dayjs.extend(isoWeek);

const MentionTrendCard = ({ onMaxDateChange, height }) => {
  const [viewMode, setViewMode] = useState('day');

  const rawData = useMemo(() => [
    { date: '2025-06-01', value: 20 },
    { date: '2025-06-02', value: 35 },
    { date: '2025-06-03', value: 25 },
    { date: '2025-06-04', value: 40 },
    { date: '2025-06-05', value: 38 },
    { date: '2025-06-06', value: 50 },
    { date: '2025-06-07', value: 30 },
    { date: '2025-06-08', value: 27 },
    { date: '2025-06-09', value: 33 },
    { date: '2025-06-10', value: 42 },
    { date: '2025-06-11', value: 37 },
    { date: '2025-06-12', value: 65 },
    { date: '2025-06-13', value: 48 },
    { date: '2025-06-14', value: 28 },
    { date: '2025-06-15', value: 36 },
  ], []);

  const tabs = [
    { id: 'day', label: '일별' },
    { id: 'week', label: '주별' },
    { id: 'month', label: '월별' },
  ];

  const groupBy = (unit) => {
    const grouped = {};
    rawData.forEach(({ date, value }) => {
      const key =
        unit === 'week'
          ? dayjs(date).startOf('isoWeek').format('YYYY-[W]WW')
          : dayjs(date).format('YYYY-MM');
      grouped[key] = (grouped[key] || 0) + value;
    });

    return Object.entries(grouped)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => (a.date > b.date ? 1 : -1));
  };

  const chartData = useMemo(() => {
    if (viewMode === 'week') return groupBy('week');
    if (viewMode === 'month') return groupBy('month');
    return rawData;
  }, [viewMode]);

  useEffect(() => {
    const maxValueDate = rawData.reduce((max, curr) =>
      curr.value > max.value ? curr : max
    );
    onMaxDateChange(maxValueDate.date);
  }, [rawData, onMaxDateChange]);

    const config = {
      data: chartData,
      xField: 'date',
      yField: 'value',
      height,
      smooth: true,
      autoFit: true,
      point: {
        size: 5,
        shape: 'diamond',
      },
      area: {
        style: {
          fill: 'l(270) 0:#4A90E2 1:#ffffff00',
        },
      },
      lineStyle: {
        stroke: '#4A90E2',
        lineWidth: 2,
      },
      interaction: {
        tooltip: { marker: false },
      },
      slider: {
        start: 0,
        end: 1,
      },
    };


  return (
    <Card
      title="언급량 추이"
      style={{ width: '100%', borderRadius: '20px' }}
      bodyStyle={{ paddingBottom: 0 }}
      extra={
        <LayoutGroup>
          <div className="trend-tab-list">
  {tabs.map((tab) => (
    <button
  key={tab.id}
  onClick={() => setViewMode(tab.id)}
  className={`trend-tab-button ${viewMode === tab.id ? 'active' : ''}`}
>
  <span className="tab-label">{tab.label}</span>
  {viewMode === tab.id && (
    <motion.span
      layoutId="bubble"
      className="trend-tab-indicator"
      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
    />
  )}
</button>
  ))}
</div>

        </LayoutGroup>
      }
    >
      <Line {...config} />
    </Card>
  );
};

export default MentionTrendCard;
