import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileTextOutlined, FolderOpenOutlined, PieChartOutlined } from '@ant-design/icons';

// ✅ 예시 링크 데이터 구조
const links = [
  {
    label: '기업 관련',
    icon: <FileTextOutlined />,
    submenu: [
      { label: '기업 정보', url: '/semi/company', color: 'bg-red-400' },
      { label: '기업 리뷰 분석', url: '/semi/companyreview', color: 'bg-blue-400' },
    ],
  },
  {
    label: '소셜 분석',
    icon: <FolderOpenOutlined />,
    submenu: [
      { label: '언급량 분석', url: '/semi/mention', color: 'bg-yellow-400' },
      { label: '연관어 분석', url: '/semi/association', color: 'bg-green-400' },
      { label: '긍/부정 분석', url: '/semi/reputation', color: 'bg-purple-400' },
    ],
  },
  {
    label: '비교 분석',
    icon: <PieChartOutlined />,
    submenu: [
      { label: '언급량 비교', url: '/semi/compare/mention', color: 'bg-orange-400' },
      { label: '연관어 비교', url: '/semi/comparekeyword', color: 'bg-pink-400' },
      { label: '긍/부정 비교', url: '/semi/compare/reputation', color: 'bg-indigo-400' },
    ],
  },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({
    '기업 관련': true,
    '소셜 분석': true,
    '비교 분석': true
  });
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = (menuLabel) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuLabel]: !prev[menuLabel]
    }));
  };

  return (
    <>
      {/* 배경 오버레이 (모바일) */}
      <button
        className={`fixed inset-0 bg-stone-800 transition-all z-10 ${
          open ? 'opacity-30 visible' : 'opacity-0 invisible'
        } sm:hidden`}
        onClick={() => setOpen(false)}
        type="button"
        aria-label="Close menu"
      />

      {/* 사이드바 본체 */}
      <aside
        className={`max-sm:fixed bg-[#FBF7F4] inset-0 end-auto flex flex-col gap-10 p-3 pr-4 max-sm:transition-transform z-20 overflow-auto sm:sticky sm:top-3 sm:max-h-[calc(100vh-1.5rem)] sm:w-56 ${
          open ? 'max-sm:translate-x-0' : 'max-sm:-translate-x-full'
        }`}
      >
        <div className="text-xl font-bold">로고</div>

        <ul className="grid gap-2 pl-0">
          {links.map(({ label, icon, submenu }) => (
            <li key={label}>
              <button
                                 className="font-bold p-2 flex gap-3 text-stone-700 w-full text-left bg-[#FBF7F4] hover:bg-stone-200 rounded-md"
                onClick={() => toggleMenu(label)}
              >
                {icon}{label}
                <span className={`ml-auto transition-transform ${expandedMenus[label] ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {submenu && expandedMenus[label] && (
                <ul className="-ml-3 mt-1">
                  {submenu.map(({ label, url, color }) => (
                    <li key={label}>
                      <button
                           className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full text-left bg-[#FBF7F4] hover:bg-[#fbf7f4] ${
                           location.pathname === url ? 'bg-[#fbf7f4] font-semibold' : ''
                         }`}
                        onClick={() => {
                          setOpen(false); // 모바일 닫기
                          
                          // 현재 회사명을 가져오기
                          const currentCompany = localStorage.getItem('companyName');
                          
                          // 기업정보 페이지로 이동할 때 회사명을 URL 파라미터로 유지
                          if (url === '/semi/company') {
                            if (currentCompany) {
                              navigate(`${url}?company=${encodeURIComponent(currentCompany)}`);
                            } else {
                              navigate(url);
                            }
                          } else {
                            // 다른 페이지로 이동할 때도 회사명을 URL 파라미터로 유지
                            if (currentCompany) {
                              navigate(`${url}?company=${encodeURIComponent(currentCompany)}`);
                            } else {
                              navigate(url);
                            }
                          }
                        }}
                      >
                        <span className={`block w-2 h-2 rounded-sm ${color}`}></span>
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-2">
          <button className="text-sm bg-[#FBF7F4] hover:bg-[#FBF7F4] w-full text-left px-3 py-2 rounded-md">로그아웃</button>
          <button
            onClick={() => setOpen(false)}
            className="text-sm text-gray-400 hover:text-black sm:hidden w-full text-left px-3 py-2"
          >
            닫기
          </button>
        </div>
      </aside>

      {/* 메뉴 열기 버튼 (모바일) */}
      <button
        onClick={() => setOpen(true)}
        className="sm:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded-md shadow"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
};

export default Sidebar;
