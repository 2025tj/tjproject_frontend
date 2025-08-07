// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const PageA = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   // App.js에서 전달받은 데이터
//   const { searchResults, searchTerm } = location.state || {};
//   // map 사용을 위한 객체 변환
//   const resultArray = Array.isArray(searchResults?.results) ? searchResults.results : [];

//   console.log("PageA에서 받은 데이터:", { searchResults, searchTerm });

//   // 검색 결과 없을 때
//   if (resultArray.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">
//             검색 결과가 없습니다
//           </h2>
//           <p className="text-gray-600 mb-6">
//             {searchTerm ? `"${searchTerm}"에 대한 검색 결과를 찾을 수 없습니다.` : '검색어를 입력해주세요.'}
//           </p>
//           <button
//             onClick={() => navigate('/')}
//             className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//           >
//             홈으로 돌아가기
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // 검색 결과 있을 때
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-6">
//         <h2 className="text-3xl font-bold text-gray-800 mb-2">
//           검색 결과
//         </h2>
//         <p className="text-gray-600">
//           "{searchTerm}"에 대한 검색 결과 {resultArray.length}개를 찾았습니다.
//         </p>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {resultArray.map((company, index) => (
//           <div
//             key={company._id || company.id || index}
//             className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
//           >
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">
//               {company.name}
//             </h3>
//             <h4>요약정보</h4>
//             {company.summary && (
//               <p className="text-gray-600 mt-2">{company.summary}</p>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="mt-8 text-center">
//         <button
//           onClick={() => navigate('/')}
//           className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
//         >
//           새로운 검색
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PageA;
