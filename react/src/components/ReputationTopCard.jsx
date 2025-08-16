import React, { useState, useEffect, useRef } from 'react';
import KeywordRankCard from './KeywordRankCard';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

const categories = [
  '정치', '경제', '사회', '문화', '국제', '지역',
  '스포츠', 'IT_과학', '범죄', '사고', '재해'
];

const ReputationTopCard = ({ summary }) => {
  const { maxType, maxPercentage } = summary;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const dropdownRef = useRef(null);
  const [customDateDropdownOpen, setCustomDateDropdownOpen] = useState(false);
  const [customSelectedDate, setCustomSelectedDate] = useState({ 
    startDate: null, 
    endDate: null
  });
  const customDateDropdownRef = useRef(null);

  // ✅ 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 날짜 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (customDateDropdownRef.current && !customDateDropdownRef.current.contains(e.target)) {
        setCustomDateDropdownOpen(false);
      }
    };
    if (customDateDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [customDateDropdownOpen]);

  // ✅ 체크박스 상태 토글
  const handleCheckboxChange = (category) => {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // ✅ 적용 버튼 클릭 핸들러
  const handleApply = () => {
    console.log('선택된 카테고리:', selected);
    setDropdownOpen(false);
    // 여기에 선택된 카테고리를 적용하는 로직을 추가할 수 있습니다
  };

  const cardItems = [
    {
      icon: null,
      title: '',
      subtitle: '',
      color: ''
    },
    {
      icon: maxType === '긍정' ? <ThumbsUp size={28} color="#5845ea" /> : <ThumbsDown size={28} color="#ea4545" />,
      title: `${maxType} ${maxPercentage}%`,
      subtitle: '가장 높은 비율',
      color: maxType === '긍정' ? '#5845ea' : '#ea4545'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" style={{ gridTemplateColumns: '1fr 2fr 2fr' }}>
      {cardItems.map((item, idx) => (
        <div
          key={idx}
          className={idx === 0 ? "flex items-center justify-center" : "relative flex items-center justify-center rounded-2xl border border-gray-100 bg-white py-2 pl-3 pr-3 dark:border-gray-800 dark:bg-white/[0.03] xl:pr-4"}
        >
          {idx === 0 ? (
            <div className="relative flex flex-col items-center w-full gap-3" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="
                  w-[110px]
                  bg-[#fbeee0]
                  border-2 border-[#422800]
                  rounded-full
                  shadow-[4px_4px_0_0_#422800]
                  text-[#422800]
                  font-semibold
                  text-sm
                  px-4 py-1
                  hover:bg-white
                  active:shadow-[2px_2px_0_0_#422800]
                  active:translate-x-[2px]
                  active:translate-y-[2px]
                  transition
                  select-none
                "
              >
                카테고리
              </button>
              
              {/* 날짜 선택 버튼 추가 */}
              <div className="relative" ref={customDateDropdownRef}>
                <button
                  onClick={() => {
                    console.log('날짜 선택 버튼 클릭됨');
                    setCustomDateDropdownOpen((prev) => !prev);
                  }}
                  className="
                    w-[110px]
                    bg-[#e0f2fb]
                    border-2 border-[#004280]
                    rounded-full
                    shadow-[4px_4px_0_0_#004280]
                    text-[#004280]
                    font-semibold
                    text-sm
                    px-4 py-1
                    hover:bg-white
                    active:shadow-[2px_2px_0_0_#004280]
                    active:translate-x-[2px]
                    active:translate-y-[2px]
                    transition
                    select-none
                  "
                >
                  날짜
                </button>
                
                {customDateDropdownOpen && (
                  <div className="absolute top-12 left-0 z-50 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-[300px]">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          시작일
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => {
                            const newDate = {
                              ...customSelectedDate,
                              startDate: e.target.value
                            };
                            setCustomSelectedDate(newDate);
                            console.log('시작일 선택:', e.target.value);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          종료일
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => {
                            const newDate = {
                              ...customSelectedDate,
                              endDate: e.target.value
                            };
                            setCustomSelectedDate(newDate);
                            console.log('종료일 선택:', e.target.value);
                          }}
                        />
                      </div>
                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          onClick={() => setCustomDateDropdownOpen(false)}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => {
                            console.log('최종 선택된 날짜:', customSelectedDate);
                            setCustomDateDropdownOpen(false);
                          }}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          확인
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {dropdownOpen && (
                <div className="absolute top-12 z-20 w-max bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg pt-4 px-4 pb-1.5">
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {categories.map((category, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-1 text-xs text-gray-800 dark:text-white cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selected.includes(category)}
                          onChange={() => handleCheckboxChange(category)}
                          className="w-4 h-4 dark:border-white/20 transition-all duration-300 ease-in-out"
                        />
                        {category}
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-center pt-1 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={handleApply}
                      className="w-24 h-8 bg-white cursor-pointer rounded-3xl border-2 border-[#9748FF] shadow-[inset_0px_-2px_0px_1px_#9748FF] group hover:bg-[#9748FF] transition duration-300 ease-in-out flex items-center justify-center"
                    >
                      <span className="font-medium text-[#333] group-hover:text-white text-xs">적용</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="text-center">
                <h4 className="mb-1 text-xl font-medium text-gray-800 dark:text-white/90" style={{ color: item.color }}>
                  {item.title}
                </h4>
                <p className="text-base text-gray-500 dark:text-gray-400">
                  {item.subtitle}
                </p>
              </div>
              <div className="absolute left-3">{item.icon}</div>
            </>
          )}
        </div>
      ))}
      <div className="relative rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] cursor-pointer">
        <div className="flex items-center justify-center h-full py-4">
          <p className="ranktitle">랭킹보기</p>
        </div>
        <div className="absolute inset-0 bg-white rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 z-10">
          <KeywordRankCard />
        </div>
      </div>
    </div>
  );
};

export default ReputationTopCard;
