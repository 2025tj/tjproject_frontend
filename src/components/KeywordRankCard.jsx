import React from 'react';
import { useSelector } from "react-redux";
import { Card } from 'antd';

const KeywordRankCard = ({ height }) => {
  const relatedKeywords = useSelector((state) => state.association.relatedKeywords);
  const sortedKeywords = [...relatedKeywords].sort((a, b) => b.value - a.value);

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span><i className="ri-folder-chart-fill" style={{ marginRight: 8}} />최근 한달</span>
          <span style={{ fontSize: 12, color: '#888' }}>(2025.07.14~2025.07.15)</span>
        </div>
      }
      style={{
        width: '100%',
        maxWidth: 400,
        borderRadius: 20,
        marginTop: 20
      }}
      styles={{ body: { padding: 0 } }} // bodyStyle 대체
    >
      <div style={{ maxHeight: height, overflowY: 'auto' }}>
        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
  <colgroup>
    <col style={{ width: '50%' }} />
    <col style={{ width: '25%' }} />
    <col style={{ width: '25%' }} />
  </colgroup>
  <thead>
    <tr>
      <th style={{ textAlign: 'center', padding: '8px' }}>연관어</th>
      <th style={{ textAlign: 'right', padding: '8px' }}>건수</th>
      <th style={{ textAlign: 'center', padding: '8px' }}>순위</th>
    </tr>
  </thead>
  <tbody>
    {sortedKeywords.map((keyword) => (
      <tr key={keyword.name}>
        <td style={{ textAlign: 'center', padding: '8px' }}>{keyword.name}</td>
        <td style={{ textAlign: 'right', padding: '8px' }}>{keyword.value.toLocaleString()}</td>
        <td style={{ textAlign: 'center', padding: '8px' }}>-</td>
      </tr>
    ))}
  </tbody>
</table>


      </div>
    </Card>
  );
};

export default KeywordRankCard;
