import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchCompanies } from '../redux/reducerSlices/companySlice';
import { Link } from 'react-router-dom';
import { fetchCompaniesByName, fetchCompaniesByType } from '../redux/reducerSlices/companySearchSlice';


const Info = () => {
  const dispatch = useDispatch();
  const { list: companies, keyword, total, searchTerm, searchType } = useSelector((state) => state.companySearch);
  //  console.log( "전달 확인", keyword, status, searchType)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;   // 결과 수

  // 🔁 useEffect로 데이터 불러오기
  useEffect(() => {
    // console.log("effe",companyList)
    // if (!companyList) return
    if (!keyword) return
    if (companies?.length > 0) return

    if (searchType === "name") {
      dispatch(fetchCompaniesByName(keyword));
    } else if (searchType === "type") {
      dispatch(fetchCompaniesByType(keyword));
    }
  }, [dispatch, searchType, keyword]);
  // console.log("검색후  ", companies)
  //  const data= companies.
  // ✅ 데이터 소스 결정
  // const data= companyList || companies
  // 로딩 및 에러 처리
  // if (status === 'loading') return <div>로딩중...</div>;
  // if (status === 'failed') return <div>에러 발생</div>;
  if (!Array.isArray(companies) || companies.length === 0) return <div>데이터 없음
    로고 클릭</div>;

  // ✅ 페이징 설정
  const totalPages = Math.ceil(companies.length / itemsPerPage);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = companies.slice(startIdx, startIdx + itemsPerPage);
  // console.log("아이템", currentItems[startIdx].산업_분야)
  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">기업 리스트</h1>

      {/* 리스트 */}
      <div className="list-container px-4 sm:px-8 md:px-12 lg:px-24 py-6">
  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
    <span className="text-indigo-600">"{keyword}"</span>에 대한 결과 총 <span className="font-bold">{total}</span>건 입니다.
  </h2>

  <div className="overflow-x-auto shadow-md rounded-lg">
    <table className="min-w-full divide-y divide-gray-200 bg-white">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="px-4 py-3 text-center text-sm font-semibold">번호</th>
          <th className="px-4 py-3 text-center text-sm font-semibold">기업명</th>
          <th className="px-4 py-3 text-center text-sm font-semibold">업종</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {currentItems.map((item, idx) => (
          <tr key={item.id || idx} className="hover:bg-indigo-50 transition duration-200 ease-in-out">
            <td className="px-4 py-3 text-center text-sm font-bold text-black-700">
              {startIdx + idx + 1}
            </td>
            <td className="px-4 py-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <Link
                  to={`/semi/company?company=${encodeURIComponent(item.name)}`}
                  // className="text-indigo-600 font-medium hover:underline hover:text-indigo-800 transition duration-150"
                  className="text-blue-700 font-medium hover:text-gray-900 transition duration-150"
                >
                  {item.name.replace(/[^\p{L}\s]/gu, "")}
                </Link>
              </div>
            </td>
            <td className="px-4 py-3 text-center text-sm text-gray-600">
              {currentItems[idx]?.산업_분야
                ?.replace(/[^\p{L}\s]/gu, "")
                ?.replace(/[0-9]/g, "")
                ?.replace("그 외 기타", "")
                ?.trim() || "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


      {/* 페이지네이션 */}
      <div className="pagination">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          이전
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          다음
        </button>
      </div>
    </div>
  );
}

export default Info;
