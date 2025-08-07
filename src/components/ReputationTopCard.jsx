import React from 'react';
import { Card } from 'antd';
import KeywordRankCard from './KeywordRankCard';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

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

const ReputationTopCard = ({ summary }) => {
  const { maxType, maxPercentage } = summary;

  
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',  
        justifyContent: 'center',
      }}
    >
      <Card style={cardStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            height: '100%',
          }}
        >
          {maxType === '긍정' ? (
            <ThumbsUp size={28} color="#5845ea" />
          ) : (
            <ThumbsDown size={28} color="#ea4545" />
          )}
          <div style={{ fontSize: '20px', color: '#5845ea', fontWeight: 'bold' }}>
            {maxType} {maxPercentage}%
          </div>
        </div>
      </Card>
      <Card style={cardStyle}>
        카드2
      </Card>
      <div style={cardStyle} className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <p className="ranktitle">랭킹보기</p>
          </div>
          <div className="flip-card-back">
            <KeywordRankCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReputationTopCard;
