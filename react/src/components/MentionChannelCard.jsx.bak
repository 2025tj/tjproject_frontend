import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const MentionChannelCard = () => {
  const [searchParams] = useSearchParams();
  const companyName = searchParams.get('company') || '회사 이름';
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Redux에서 선택된 키워드 뉴스 가져오기
  const selectedKeywordNews = useSelector((state) => state.association.selectedKeywordNews);
  const selectedKeyword = useSelector((state) => state.association.selectedKeyword);

  // 뉴스 불러오기
  const fetchCompanyNews = async (company) => {
    if (!company || company === '회사 이름') return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/api/news/latest', {
        keyword: company,
        headless: true
      });
      setNewsList(response.data.articles || []);
    } catch (err) {
      console.error('뉴스 불러오기 실패:', err);
      setError('뉴스를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyNews(companyName);
  }, [companyName]);

  // 선택된 키워드 뉴스가 있으면 그것을 사용, 없으면 기본 회사 뉴스 사용
  const displayNews = selectedKeywordNews.length > 0 ? selectedKeywordNews : newsList;
  const displayTitle = selectedKeyword ? `${companyName} - ${selectedKeyword}` : companyName;

  return (
         <div className="w-[100%] h-[561px] rounded-2xl bg-white p-4 flex flex-col gap-3 shadow-md">
       <h2 className="text-center text-xl font-semibold">{displayTitle} 최신기사</h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-full text-sm text-gray-500">
          <Spin size="small" />
          <span className="mt-2">뉴스를 불러오는 중...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 text-sm">{error}</div>
      ) : newsList.length === 0 ? (
        <div className="text-center text-gray-400 text-sm">등록된 뉴스가 없습니다.</div>
      ) : (
                 <div className="flex-1 flex flex-col gap-[5px] overflow-hidden">
           {displayNews.slice(0, 4).map((news, index) => (
            <div
              key={index}
              onClick={() => window.open(news.link, '_blank')}
                             className="group flex-1 cursor-pointer rounded-lg bg-gray-10 border border-gray-200 flex justify-center items-center relative transition-all duration-700 ease-in-out hover:flex-[4] overflow-hidden p-3"
            >
              <div className="text-center z-10 bg-white rounded-lg p-3 w-full h-full">
                {/* 제목 */}
                <p className="text-black text-sm font-semibold uppercase tracking-wide leading-normal line-clamp-2">
                  {news.title}
                </p>

                {/* 요약 */}
                <p className="text-xs text-black mt-1 line-clamp-1 group-hover:line-clamp-4 transition-all duration-700 ease-in-out">
                  {news.summary}
                </p>

                {/* 날짜 */}
                <p className="text-[11px] text-gray-500 mt-2 opacity-30 group-hover:opacity-100 transition-all duration-700 ease-in-out">
                  {news.press} • {news.date}
                </p>
              </div>
                {/* 배경 반투명 오버레이 */}
               <div className="absolute inset-0 bg-gray-100/50 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out pointer-events-none rounded-lg" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentionChannelCard;
