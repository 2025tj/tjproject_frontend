import Wordcloud from "react-d3-cloud"
import React, { useState } from 'react';
// import { SearchBar } from '../App'
import Ranking from "../components/Ranking"
import { fetchCompaniesByName, setSearchTerm, fetchCompaniesByType } from '../redux/reducerSlices/companySearchSlice';
import '../CSS/carousel.css';
import '../CSS/Search.css';

import { Carousel } from 'react-bootstrap';
import kakaoImg from '../images/kakao.png';
import kiaImg from '../images/kia.png';
import samsungImg from '../images/samsung.png';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";


// SearchBar 정의 부분
const SearchBar = React.memo(({ searchTerm, setSearchTerm, onSubmit, loading, searchType, setSearchType }) => {
  return (<>
    <div className="radio-group mt-4 my-2 flex gap-6 items-center text-black font-sans font-semibold">
      <label className="flex items-center gap-2 ">
        <input
          type="radio"
          name="search"
          value="name"
          checked={searchType === 'name'}
          onChange={e => setSearchType(e.target.value)}
        />
        기업이름
      </label>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="search"
          value="type"
          checked={searchType === 'type'}
          onChange={e => setSearchType(e.target.value)}
        />
        분야
      </label>
    </div>
    <div className="search-bar-container">
      <form onSubmit={onSubmit} className="search-form">
        <input
          type="text"
          placeholder="회사명 입력하세요..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
          className="search-input"
          required
        />
        <button
          type="submit"
          className="search-button"
          disabled={loading}
        >
          {loading ? "검색중..." : "검색"}
        </button>
      </form>
    </div>
  </>
  );
});
  
const Start = () => {
  const [searchTerm, setSearchTerms] = useState("");
  const [searchType, setSearchType] = useState("name")

  const navigate= useNavigate()
  const dispatch= useDispatch()
   const handleSubmit = (e) => {
    // useCallback((e) => {
    e.preventDefault();
    if (searchTerm.trim()) 
      dispatch(setSearchTerm(searchTerm)); // 가져옴
    //   // (searchTerm.trim());
      dispatch(fetchCompaniesByName(searchTerm.trim()))   // 검색어 찾기
    // navigate("/semi")

    if (!searchTerm.trim()) return;

    dispatch(setSearchTerm(searchTerm));

    if (searchType === "name") {
      dispatch(fetchCompaniesByName(searchTerm.trim()));
    }
    else if (searchType === "type") {
      dispatch(fetchCompaniesByType(searchTerm.trim()));
    }
    navigate("/info")
  }

  // CompanyLists 컴포넌트 정의
  const CompanyLists = () => (
    <section>
      {/* 기업 분류 목록 섹션 */}
    </section>
  );

  //최근 이슈기업 슬라이더 구역
  function ImageSlider() {
    const images = [
      { src: kakaoImg, alt: '카카오' },
      { src: kiaImg, alt: '기아' },
      { src: samsungImg, alt: '삼성' },
    ];

    return (
      <div className="my-12 font-sans">
        <h2 className="text-xl font-bold text-left mb-4">주요 기업 소식( 최근 이슈 기업)</h2>
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <Carousel>
              {images.map((image, index) => (
                <Carousel.Item key={index}>
                  <div
                    style={{
                      height: '250px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#84b0dbff',
                    }}
                  >
                    <img
                      className="d-block"
                      style={{
                        maxHeight: '80%',
                        maxWidth: '80%',
                        objectFit: 'contain',
                      }}
                      src={image.src}
                      alt={image.alt}
                    />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="font-sans">
        <div className="main-bg relative h-[60vh] rounded-lg overflow-hidden mb-12">
          <div className="relative z-7 flex flex-col justify-end items-center h-full text-white p-8">
            <p className="text-xl md:text-2xl font-medium text-black  to-gray-800/60 px-6 py-3 rounded-lg shadow-lg backdrop-blur-md max-w-2xl text-center leading-snug">
                <span className="font-bold text-black-200 mt- text-2xl">데이터</span>로 읽는&nbsp;
                <span className="text- font-semibold text-2xl">기업의 감정</span>,<br className="hidden md:inline" />
                &nbsp;
                <span className="text-purple-800 font-bold underline decoration-purple-400/70">인사이트</span>도 한 눈에,
              </p>
              <SearchBar
            searchTerm={searchTerm} // `searchTerm` prop을 전달했지만
            setSearchTerm={setSearchTerms} // 
            searchType={searchType}
            setSearchType={setSearchType}
            onSubmit={handleSubmit} // `onSubmit` prop은 (A)에서 잘 받고 사용합니다.
            ></SearchBar>
          </div>
        </div>
        <Ranking />
        <CompanyLists />
        <ImageSlider />
      </div>
    </>
  )
}

export default Start;
