import React from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import KeywordRankCard from './KeywordRankCard';
import { Crown } from 'lucide-react';

const AssociationTopCard = () => {
  const [searchParams] = useSearchParams();
  const companyName = searchParams.get("company") || "";
  
  // Redux 상태에서 키워드 데이터 가져오기
  const relatedKeywords = useSelector((state) => state.association.relatedKeywords);
  const keywordState = useSelector((state) => state.keyword);
  const { currentResult } = keywordState;

  // AssociationMapCard와 동일한 로직으로 키워드 데이터 결정
  const displayKeywords = currentResult?.overall_keywords?.length > 0 
    ? currentResult.overall_keywords.map(kw => ({
        name: kw.keyword,
        value: parseInt(kw.count) || 0
      }))
    : relatedKeywords;

  // 값이 0보다 큰 키워드 중에서 최대값 찾기
  const validKeywords = displayKeywords.filter(keyword => keyword.value > 0);
  const topKeywordObj = validKeywords?.reduce(
    (max, curr) => (curr.value > (max?.value ?? -Infinity) ? curr : max),
    null
  );
  const topKeyword = topKeywordObj?.name || '데이터 없음';

  const cardItems = [
    {
      icon: <Crown size={28} color="#5845ea" />,
      title: topKeyword,
      subtitle: '연관어 Top 1',
      color: '#5845ea'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cardItems.map((item, idx) => (
        <div
          key={idx}
          className="relative flex items-center justify-center rounded-2xl border border-gray-100 bg-white py-2 pl-3 pr-3 dark:border-gray-800 dark:bg-white/[0.03] xl:pr-4"
        >
          <div className="text-center">
            <h4 className="mb-1 text-xl font-medium text-gray-800 dark:text-white/90" style={{ color: item.color }}>
              {item.title}
            </h4>
            <p className="text-base text-gray-500 dark:text-gray-400">
              {item.subtitle}
            </p>
          </div>
          <div className="absolute left-3">{item.icon}</div>
        </div>
      ))}
      <div className="flex items-center justify-center rounded-2xl border border-gray-100 bg-white py-4 pl-4 pr-4 dark:border-gray-800 dark:bg-white/[0.03] xl:pr-5">
        <KeywordRankCard />
      </div>
    </div>
  );
};

export default AssociationTopCard;