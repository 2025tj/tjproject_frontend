import React from 'react';
import ReputationCard from '../components/ReputationCard';
import MentionChannelCard from '../components/MentionChannelCard';
import { Row, Col } from 'antd';
import { useState } from 'react';

const Reputation = () => {
  const [summary, setSummary] = useState({ maxType: null, maxPercentage: null });
  const cardHeight = 480; // 두 카드의 높이를 동일하게 맞춤

  return (
    <div className="min-h-screen bg-[#FBF7F4] p-1">
      <Row gutter={20}>
        

        <Col xs={24} md={14}>
          <ReputationCard onCalculateSummary={setSummary} height={cardHeight}/>
        </Col>
        <Col xs={24} md={10}>
          <MentionChannelCard
            totalCount={1000}
            viewCount={500}
            height={cardHeight}
          />
        </Col>
        
      </Row>
    </div>
  );
};

export default Reputation;

