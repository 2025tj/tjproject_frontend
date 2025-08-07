import React from 'react';
import { Card } from 'antd';
import { CalendarDays } from 'lucide-react';

const cardStyle = {
  flex: '1 0 430px',
  maxWidth: 300,
  minHeight: 90,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  borderRadius: '20px',
};

const MentionTopCard = ({ maxDate }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px', // 카드 간 간격
        justifyContent: 'center',
      }}
    >
      <Card style={cardStyle} bodyStyle={{ padding: '0px' }}>
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}
  >
    <CalendarDays size={32} color="#5845ea" />
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontSize: '20px', color: '#5845ea', fontWeight: 'bold' }}>
        {maxDate}
      </div>
      <div style={{ marginTop: 4 }}>언급량이 가장 많았던 날</div>
    </div>
  </div>
</Card>

      <Card style={cardStyle}>카드 2</Card>
      <Card style={cardStyle}>카드 3</Card>
    </div>
  );
};

export default MentionTopCard;
