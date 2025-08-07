import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { submitReview } from '../redux/reducerSlices/companySlice';
// import { fetchReviews } from '../redux/reducerSlices/companySlice';
import { Card, Row, Col, Divider, Typography, Spin, Alert, Empty } from 'antd';
import { fetchCompanies, setCompanyName, setCompanyData } from '../redux/reducerSlices/companySlice';
import '../CSS/review.css';
import '../CSS/newscard.css';

const { Title, Text, Paragraph } = Typography;


const CompanyInfo = () => {
  const dispatch = useDispatch();
  const companyName = useSelector((state) => state.company.companyName);
  const newsList = useSelector((state) => state.news.list);
  // const { reviews, reviewStatus, hasNextPage, currentPage } = useSelector(state => state.company);
  //✅회사 정보 불러오기
  useEffect(() => {
  const localCompany = localStorage.getItem('companyName');
  const localData = localStorage.getItem('companyData');

  if (companyName) {
    if (companyName === localCompany && localData) {
      // 캐시와 동일하면 fetch 생략
      dispatch(setCompanyName(localCompany));
      dispatch(setCompanyData(JSON.parse(localData)));
    } else {
      // 주소창에서 온 새로운 요청은 fetch
      dispatch(setCompanyName(companyName));
      localStorage.setItem('companyName', companyName);
      dispatch(fetchCompanies(companyName)).then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          localStorage.setItem('companyData', JSON.stringify(action.payload));
        }
      });
    }
  } else if (localCompany && localData) {
    dispatch(setCompanyName(localCompany));
    dispatch(setCompanyData(JSON.parse(localData)));
  }
}, [companyName, dispatch]);

//   //✅리뷰 목록 불러오기
//   useEffect(() => {
//   if (companyName) {
//     dispatch(fetchReviews({ companyName, page: 1 }));
//   }
//   }, [companyName, dispatch]);

//   const observerRef = useRef();
//   useEffect(() => {
//     const observer = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting && hasNextPage && reviewStatus !== "loading") {
//         dispatch(fetchReviews({ companyName, page: currentPage }));
//       }
//     });

//     if (observerRef.current) observer.observe(observerRef.current);
//     return () => observer.disconnect();
//   }, [reviewStatus, hasNextPage, currentPage, companyName, dispatch]);

//   //✅리뷰 보내기 onClick
//   const handleSubmitReview = () => {
//   const textarea = document.querySelector('textarea');
//   const isAnonymous = document.querySelector('.check-container input[type="checkbox"]').checked;
//   const content = textarea?.value.trim();
//   const userId = 'user1234';
//   if (!content) return alert("내용을 입력해주세요.");

//   dispatch(submitReview({
//     companyName,
//     userId,
//     isAnonymous,
//     content,
//     timestamp: new Date().toISOString()
//   }));
//   textarea.value = '';
// };

  const filteredNews = newsList
  .filter((item) => item.summary.includes(companyName))
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 6);


  const { companies, status, error } = useSelector((state) => state.company);

  if (status === "loading") return <Spin />;
  if (error) return <Alert message={error} type="error" showIcon />;
  if (!companies || companies.length === 0) return <Empty description="검색된 회사가 없습니다." />;

  const company = companies[0]; // 1개만 보여줄 경우
  const excludedFields = ["_id", "id", "name", "crawled_at", "ISIN"];
  const logo = company?.["로고"];
  const summary = company?.["summary"];
  const website = company?.["웹사이트"];

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
        <Card
          style={{
            borderRadius: 20,
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* 상단 - 로고 + 기업명 + 웹사이트 */}
          <Row justify="center" style={{ textAlign: 'center' }}>
            <Col>
              {logo && (
                <img
                  src={logo}
                  alt="기업 로고"
                  style={{
                    maxHeight: 80,
                    maxWidth: 200,
                    objectFit: 'contain',
                    marginBottom: 8
                  }}
                />
              )}
              {company?.["기업명"] && <Title level={4}>{company["기업명"]}</Title>}
              {website && (
                <a
                  href={website.startsWith("http") ? website : `https://${website}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {website}
                </a>
              )}
            </Col>
          </Row>

          <Row justify="center">
            <Col xs={24} md={20}>
              {summary && (
                <>
                  <Title level={5}>기업 개요</Title>
                  <Paragraph>{summary}</Paragraph>
                  <Divider />
                </>
              )}

              <Row gutter={[64, 8]}>
                {company && Object.entries(company)
                  .filter(([key, value]) =>
                    value !== null &&
                    value !== "" &&
                    !excludedFields.includes(key) &&
                    !["로고", "summary", "웹사이트", "기업명"].includes(key)
                  )
                  .map(([key, value]) => (
                    <Col xs={24} sm={12} key={key}>
                      <Text strong>{key}</Text>
                      <div style={{ marginTop: 4 }}>
                        {typeof value === "string" && value.includes("\n") ? (
                          value.split("\n").map((line, i) => <div key={i}>{line}</div>)
                        ) : typeof value === "string" && value.startsWith("http") ? (
                          <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
                        ) : (
                          String(value)
                        )}
                      </div>
                    </Col>
                  ))}
              </Row>
            </Col>
          </Row>
        </Card>   
        {/* 
  <div className="reviewcard">
  <span className="title">Comments</span>
    {/*✅등록된 리뷰칸*/}
    <div className="comments">
      {/* {reviews.length === 0 ? (
        <p style={{ textAlign: 'center' }}>등록된 리뷰가 없습니다.</p>
      ) : (
        reviews.map((review, index) => (
          <div className="comment-card" key={index}>
            <div className="comment-container">
              <div className="user">{review.user_id || "익명"}</div>
              <p className="comment-content">{review.content}</p>
              <label className="like">
                <input type="checkbox" />
                <div className="checkmark">
                  <svg fill="none" viewBox="0 0 24 24">...</svg>
                </div>
              </label>
            </div>
            <div className="comment-timestamp">
              {new Date(review.timestamp).toLocaleString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </div>
          </div>
        ))
      )}
      <div ref={observerRef} style={{ height: 1 }}></div>
    </div> */}

    {/* <div className="text-box">
      <div className="box-container">
        <div className="input-layout">
          <textarea placeholder="회사에 대한 의견을 남겨주세요" />

          <div className="submit-area">
            <label className="check-container">
              <input type="checkbox" />
              <svg viewBox="0 0 64 64" height="1.5em" width="1.5em">
                <path
                  d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                  pathLength="575.0541381835938"
                  className="path"
                ></path>
              </svg>
              <span className="check-label">익명</span>
            </label>
            <div className="formatting">
              <button type="submit" className="send" title="Send" onClick={handleSubmitReview}>
                작성
              </button>
            </div>
          </div>

        </div>
      </div>
    </div> */}

  </div>

    </div>
      <div className="newscard">
        <h2>NEWS</h2>
        {filteredNews.length === 0 ? (
          <p style={{ textAlign: 'center' }}>등록된 뉴스가 없습니다.</p>
        ) : (
          filteredNews.map((item, index) => {
            const lines = item.summary.split('\n');
            const matchLines = lines.filter((line) => line.includes(companyName));
            const mainLine = matchLines[0] || '';
            const extraLines = matchLines.slice(1, 3);

            return (
              <div
                key={index}
                className="news-card-item"
                onClick={() => window.open(item.link, '_blank')}
              >
                <p className="news-title">{item.title}</p>
                <p className="news-summary main">{mainLine}</p>
                {extraLines.length > 0 && (
                  <div className="hover-summary">
                    {extraLines.map((line, i) => (
                      <p key={i} className="news-summary extra">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CompanyInfo;
