import React from 'react';
import MentionTrendCard from '../components/MentionTrendCard'
import MentionChannelCard from '../components/MentionChannelCard';
import { Row, Col } from 'antd';
import MentionTopCard from '../components/MentionTopCard';
import { useState } from 'react';



const MentionPage = () => {
  const [maxDate, setMaxDate] = useState(null);
  const cardHeight = 480; // 두 카드의 높이를 동일하게 맞춤
  // 대충 임시 데이터
  const dummyItems = [
    {
      icon: 'https://via.placeholder.com/20', // 아이콘 이미지
      title: '샘플 제목 <strong>강조</strong>',
      text: '본문 내용 일부 <em>이탤릭</em>',
      url: 'https://example.com',
    },
    {
      icon: 'https://via.placeholder.com/20',
      title: '다른 기사 제목',
      text: '다른 기사 내용',
      url: 'https://example.com/2',
    },
  ];
  
  return (
    <div className="min-h-screen bg-[#FBF7F4] p-1">
      <Row gutter={20}>
        <Col xs={24}>
          <div className="mb-3">
            <MentionTopCard maxDate={maxDate}/>
          </div>
        </Col>

        <Col xs={24} md={14}>
          <MentionTrendCard onMaxDateChange={setMaxDate} height={cardHeight}/>
        </Col>
        <Col xs={24} md={10}>
          <MentionChannelCard
            keyword="삼성전자"
            period="2025-06-09 ~ 2025-06-13"
            totalCount={1000}
            viewCount={500}
            items={dummyItems}
            height={cardHeight}
          />
        </Col>
      </Row>
    </div>
  );
};

export default MentionPage;
