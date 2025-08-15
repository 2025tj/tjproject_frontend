import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import AssociationMapCard from '../components/AssociationMapCard';
import MentionChannelCard from '../components/MentionChannelCard';
import AssociationTopCard from '../components/AssociationTopCard';
import { Row, Col } from 'antd';
import KeywordRankCard from '../components/KeywordRankCard';
import { setCurrentKeyword, clearResults } from '../redux/reducerSlices/keywordSlice';

const AssociationPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const companyName = searchParams.get("company") || "";
  
  // Redux 상태
  const centerKeyword = useSelector((state) => state.association.centerKeyword);
  const keywordState = useSelector((state) => state.keyword);
  
  const cardHeight = 561; // 두 카드의 높이를 동일하게 맞춤

  // 회사명이나 중심 키워드가 변경되면 키워드 분석 초기화
  useEffect(() => {
    if (centerKeyword) {
      dispatch(setCurrentKeyword(centerKeyword));
      // 새로운 키워드로 변경되면 기존 결과 초기화
      dispatch(clearResults());
    }
  }, [centerKeyword, companyName, dispatch]);

  return (
    <div className="min-h-screen bg-[#FBF7F4] p-1">
      <Row gutter={20}>
        <Col xs={24}>
          <div className="mb-3">
            <AssociationTopCard />
          </div>
        </Col>
        
        <Col xs={24} md={14}>
          <AssociationMapCard height={cardHeight}/>
        </Col>
        <Col xs={24} md={10}>
          <MentionChannelCard
            totalCount={1000}
            viewCount={500}
            height={cardHeight}
          />
        </Col>
        
      </Row>
      
      {/* 키워드 분석 상태 표시 (개발용, 필요시 제거) */}
      {keywordState.error && (
        <div style={{ 
          position: 'fixed', 
          bottom: 20, 
          right: 20, 
          background: '#ff4d4f', 
          color: 'white', 
          padding: '10px 15px', 
          borderRadius: '8px',
          zIndex: 1000,
          maxWidth: '300px'
        }}>
          키워드 분석 오류: {keywordState.error}
        </div>
      )}
    </div>
  );
};

export default AssociationPage;