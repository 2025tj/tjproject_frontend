import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'antd';
import KeywordRankCard from './KeywordRankCard';
import { Crown } from 'lucide-react';
import '../CSS/rankcard.css';

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

const AssociationTopCard = () => {
  const relatedKeywords = useSelector((state) => state.association.relatedKeywords);

  const topKeywordObj = relatedKeywords?.reduce(
    (max, curr) => (curr.value > (max?.value ?? -Infinity) ? curr : max),
    null
  );
  const topKeyword = topKeywordObj?.name || '데이터 없음';

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
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
        <Crown size={32} color="#5845ea"/>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '20px', color: '#5845ea', fontWeight: 'bold' }}>
              {topKeyword}
            </div>  
            <div style={{ marginTop: 8 }}>연관어 Top 1</div>
          </div>
        </div>
      </Card>

      <Card style={cardStyle}>카드 2</Card>

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

export default AssociationTopCard;
