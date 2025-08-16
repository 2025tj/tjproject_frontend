import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { submitReview, fetchReviews, updateReview, deleteReview, likeReview } from '../redux/reducerSlices/companySlice';
import { Card, Row, Col, Divider, Typography, Spin, Alert, Empty, Button, Modal, Input, message } from 'antd';
import { fetchCompanies, setCompanyName, setCompanyData, clearReviews } from '../redux/reducerSlices/companySlice';
import { EditOutlined, DeleteOutlined, LikeOutlined, DislikeOutlined, MessageOutlined } from '@ant-design/icons';

import '../CSS/newscard.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const CompanyInfo = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [replyToReview, setReplyToReview] = useState(null);
  const [textareaContent, setTextareaContent] = useState('');
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [replyCounts, setReplyCounts] = useState({});

  const toggleAnonymous = () => setIsAnonymous(prev => !prev);

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const companyNameFromURL = searchParams.get('company');
  const companyName = useSelector((state) => state.company.companyName);
  const newsList = useSelector((state) => state.news.list);
  const { reviews, totalReviews } = useSelector(state => state.company);
  
  // targetCompanyName을 컴포넌트 레벨에서 한 번만 계산
  const targetCompanyName = companyNameFromURL || companyName;
  
  //✅회사 정보 불러오기
  useEffect(() => {
  const localCompany = localStorage.getItem('companyName');
  const localData = localStorage.getItem('companyData');

  // URL에서 company 파라미터를 우선적으로 사용

  if (targetCompanyName) {
    if (targetCompanyName === localCompany && localData) {
      // 캐시와 동일하면 fetch 생략
      dispatch(setCompanyName(localCompany));
      dispatch(setCompanyData(JSON.parse(localData)));
    } else {
      // 주소창에서 온 새로운 요청은 fetch
      dispatch(setCompanyName(targetCompanyName));
      localStorage.setItem('companyName', targetCompanyName);
      dispatch(fetchCompanies(targetCompanyName)).then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          localStorage.setItem('companyData', JSON.stringify(action.payload));
        }
      });
    }
  } else if (localCompany && localData) {
    dispatch(setCompanyName(localCompany));
    dispatch(setCompanyData(JSON.parse(localData)));
  }
}, [companyNameFromURL, companyName, dispatch]);

  //✅리뷰 목록 불러오기
  useEffect(() => {
  if (targetCompanyName) {
    // 컴포넌트가 마운트될 때 리뷰 상태 초기화
    dispatch(fetchReviews({ companyId: targetCompanyName }));
  }
  
  // 컴포넌트가 언마운트될 때 리뷰 상태 초기화
  return () => {
    dispatch(clearReviews());
  };
  }, [targetCompanyName, dispatch]);

  //✅답글 개수 계산
  useEffect(() => {
    if (reviews.length > 0) {
      const counts = calculateReplyCounts(reviews);
      setReplyCounts(counts);
    }
  }, [reviews]);

  //✅리뷰 보내기 onClick
  const handleSubmitReview = () => {
  const content = textareaContent.trim();
  if (!content) return message.error("내용을 입력해주세요.");

  dispatch(submitReview({
    companyId: targetCompanyName,
    content,
    parentId: replyToReview ? replyToReview.id : null
  })).then((action) => {
    if (action.meta.requestStatus === 'fulfilled') {
      // 리뷰 작성 성공 후 리뷰 목록 새로 불러오기
      dispatch(fetchReviews({ companyId: targetCompanyName }));
      setTextareaContent('');
      setReplyToReview(null);
      setEditingReview(null);
      // 답글 작성 후 해당 댓글의 답글을 펼쳐서 보여주기
      if (replyToReview) {
        setExpandedReplies(prev => new Set([...prev, replyToReview.id]));
      }
    } else {
      message.error("리뷰 작성에 실패했습니다.");
    }
  });
};

  //✅리뷰 수정
  const handleEditReview = () => {
    if (!textareaContent.trim()) {
      message.error("내용을 입력해주세요.");
      return;
    }

    dispatch(updateReview({
      reviewId: editingReview.id,
      content: textareaContent
    })).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        dispatch(fetchReviews({ companyId: targetCompanyName }));
        message.success("리뷰가 성공적으로 수정되었습니다.");
        setEditingReview(null);
        setReplyToReview(null);
        setTextareaContent('');
      } else {
        message.error("리뷰 수정에 실패했습니다.");
      }
    });
  };

  //✅리뷰 삭제
  const handleDeleteReview = (reviewId) => {
    Modal.confirm({
      title: '리뷰 삭제',
      content: '리뷰를 삭제하시겠습니까?',
      onOk() {
        dispatch(deleteReview({ reviewId })).then((action) => {
          if (action.meta.requestStatus === 'fulfilled') {
            dispatch(fetchReviews({ companyId: targetCompanyName }));
          } else {
            message.error("리뷰 삭제에 실패했습니다.");
          }
        });
      }
    });
  };

  //✅리뷰 공감/취소
  const handleLikeReview = (reviewId) => {
    dispatch(likeReview({ reviewId })).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        dispatch(fetchReviews({ companyId: targetCompanyName }));
      } else {
        message.error("공감 처리에 실패했습니다.");
      }
    });
  };

  //✅답글 개수 계산
  const calculateReplyCounts = (reviews) => {
    const counts = {};
    reviews.forEach(review => {
      // 계층형 구조에서 replies 배열의 길이를 사용
      if (review.replies && review.replies.length > 0) {
        counts[review.id] = review.replies.length;
      }
    });
    return counts;
  };

  //✅답글 펼치기/접기 토글
  const toggleReplies = (reviewId) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReplies(newExpanded);
  };

  //✅대댓글 작성 시작
  const handleReplyClick = (review) => {
    setReplyToReview(review);
    setEditingReview(null);
    setTextareaContent('');
  };

  //✅리뷰 수정 시작
  const handleEditClick = (review) => {
    setEditingReview(review);
    setReplyToReview(null);
    setTextareaContent(review.content);
  };

  const filteredNews = newsList
  .filter((item) => item.summary.includes(targetCompanyName))
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 6);


  const { companies, status, error } = useSelector((state) => state.company);


  if (status === "loading") return <Spin />;
  if (error) return <Alert message={error} type="error" showIcon />;
  if (!companies || companies.length === 0) return <Empty description="검색된 회사가 없습니다." />;

  const company = companies[0]; // 1개만 보여줄 경우
  
  const excludedFields = ["_id", "id", "crawled_at", "ISIN"];
  
  // 로고를 찾는 함수 - 여러 위치에서 로고를 찾음
  const findLogo = (company) => {
    // 기본 필드에서 로고 찾기
    if (company?.["로고"]) return company["로고"];
    if (company?.logo) return company.logo;
    if (company?.image) return company.image;
    
    // extra_fields에서 로고 찾기
    if (company?.extra_fields) {
      const extra = company.extra_fields;
      if (extra["로고"]) return extra["로고"];
      if (extra.logo) return extra.logo;
      if (extra.image) return extra.image;
    }
    
    return null;
  };
  
  const logo = findLogo(company);
  const summary = company?.["summary"];
  const website = company?.["웹사이트"];

  // 로고 URL이 유효한지 확인하는 함수
  const isValidImageUrl = (url) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image');
  };

  // 리뷰 렌더링 함수
  const renderReview = (review, depth = 0) => {
    const isReply = depth > 0;
    const marginLeft = depth * 20;
    const replyCount = replyCounts[review.id] || 0;
    const isExpanded = expandedReplies.has(review.id);
    // 계층형 구조에서 replies 배열 사용
    const childReplies = review.replies || [];

    return (
      <div key={review.id} className="bg-slate-50 border border-slate-200 p-3 rounded-lg mb-3" style={{ marginLeft: isReply ? `${Math.min(marginLeft, 40)}px` : '0px' }}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-2">
          <div className="font-semibold text-slate-800">
            {review.userId === 123 ? '테스트유저' : `사용자${review.userId}`}
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <Button 
              type="default" 
              size="small" 
              icon={<LikeOutlined />}
              onClick={() => handleLikeReview(review.id)}
              className="text-xs min-w-[60px]"
            >
              {review.likeCount}
            </Button>
            {!isReply && (
              <Button 
                type="default" 
                size="small" 
                icon={<MessageOutlined />}
                onClick={() => handleReplyClick(review)}
                className="text-xs min-w-[60px]"
              >
                답글
              </Button>
            )}
            <Button 
              type="default" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => handleEditClick(review)}
              className="text-xs min-w-[60px]"
            >
              수정
            </Button>
            <Button 
              type="default" 
              size="small" 
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteReview(review.id)}
              className="text-xs min-w-[60px]"
            >
              삭제
            </Button>
          </div>
        </div>
        <div className="text-slate-600 whitespace-pre-line break-words mb-2">
          {review.content}
        </div>
        <div className="flex justify-between items-center">
          <div className="text-xs text-slate-400">
            {new Date(review.createdAt).toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </div>
          {!isReply && replyCount > 0 && (
            <button
              onClick={() => toggleReplies(review.id)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {isExpanded ? '답글 접기' : `답글 ${replyCount}개 보기`}
            </button>
          )}
        </div>
        
        {/* 답글 표시 */}
        {!isReply && isExpanded && childReplies && childReplies.length > 0 && (
          <div className="mt-3 space-y-2">
            {childReplies.map(reply => renderReview(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FBF7F4] p-1">
      {/* 1. 기업정보: 가로 전체 */}
      <div style={{ width: '100%', marginBottom: '24px' }}>
        <Card
          style={{
            borderRadius: 20,
            minHeight: '400px',
            height: 'auto',
          }}
        >
          {/* 상단 - 로고 + 기업명 + 웹사이트 */}
          <Row justify="center" style={{ textAlign: 'center' }}>
            <Col>
              {logo && isValidImageUrl(logo) && (
                <img
                  src={logo}
                  alt="기업 로고"
                  style={{
                    maxHeight: 80,
                    maxWidth: 200,
                    objectFit: 'contain',
                    marginBottom: 8
                  }}
                  onError={(e) => {
                    console.error('로고 이미지 로드 실패:', logo);
                    e.target.style.display = 'none';
                  }}
                />
              )}
              {company?.name && <Title level={4}>{company.name}</Title>}
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
                {/* 기본 필드들 */}
                {company && Object.entries(company)
                  .filter(([key, value]) =>
                    value !== null &&
                    value !== "" &&
                    !excludedFields.includes(key) &&
                    !["로고", "summary", "웹사이트", "name", "extra_fields"].includes(key)
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
                {/* extra_fields 처리 */}
                {company?.extra_fields && typeof company.extra_fields === 'object' && 
                  Object.entries(company.extra_fields)
                    .filter(([key, value]) => 
                      value !== null && 
                      value !== "" && 
                      key !== "로고" && 
                      key !== "logo" && 
                      key !== "image"
                    )
                    .map(([key, value]) => (
                      <Col xs={24} sm={12} key={`extra_${key}`}>
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
                    ))
                }
              </Row>
            </Col>
          </Row>
        </Card>
      </div>

      {/* 2. 리뷰/뉴스 2단 레이아웃 */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* 왼쪽: 리뷰 */}
        <div style={{ flex: 2, minWidth: 0 }}>
          <div className="bg-white border border-slate-200 grid grid-cols-6 gap-2 rounded-xl p-4 text-sm mb-4">
            <h1 className="text-base font-semibold col-span-6 mb-1">댓글 ({totalReviews}개)</h1>
            {/* 댓글 목록 */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 col-span-6 text-sm space-y-3 max-h-[400px] overflow-y-auto">
              {reviews.length === 0 ? (
                <p className="text-center text-gray-500">등록된 리뷰가 없습니다.</p>
              ) : (
                reviews.map((review) => renderReview(review))
              )}
            </div>
            {/* 작성 영역 */}
            <textarea
              value={textareaContent}
              onChange={(e) => setTextareaContent(e.target.value)}
              className="bg-slate-100 text-slate-600 h-28 placeholder:text-slate-600 placeholder:opacity-50 border border-slate-200 col-span-6 resize-none outline-none rounded-lg p-2 duration-300 focus:border-slate-600"
              placeholder={
                editingReview ? "수정할 내용을 입력하세요" :
                replyToReview ? `${replyToReview.userId === 123 ? '테스트유저' : `사용자${replyToReview.userId}`}님에게 답글 작성...` : 
                "의견을 적어주세요"
              }
            />
            {/* 익명 버튼 */}
            <button
              type="button"
              onClick={toggleAnonymous}
              className={`col-span-1 flex justify-center items-center rounded-lg p-2 duration-300 border border-slate-200
                ${isAnonymous ? 'bg-blue-400 text-white fill-white' : 'bg-slate-100 text-slate-600 fill-slate-600'}
              `}
            >
              익명
            </button>
            {/* 취소 버튼 (답글 또는 수정 모드일 때만 표시) */}
            {(replyToReview || editingReview) && (
              <button
                type="button"
                onClick={() => {
                  setReplyToReview(null);
                  setEditingReview(null);
                  setTextareaContent('');
                }}
                className="col-span-1 flex justify-center items-center rounded-lg p-2 duration-300 border border-slate-200 bg-red-100 text-red-600 hover:bg-red-200"
              >
                취소
              </button>
            )}
            <span className={(replyToReview || editingReview) ? "col-span-2" : "col-span-3"} />
            {/* 작성/수정 버튼 */}
            <button
              onClick={editingReview ? handleEditReview : handleSubmitReview}
              className="bg-slate-100 stroke-slate-600 border border-slate-200 col-span-2 flex justify-center rounded-lg items-center duration-300 hover:text-white hover:stroke-white hover:bg-blue-400"
            >
              {editingReview ? '수정' : '작성'}
            </button>
          </div>
        </div>
        {/* 오른쪽: 뉴스 */}
        <div className="newscard" style={{ flex: 1, minWidth: '300px', maxWidth: '400px' }}>
          <h2>NEWS</h2>
          {filteredNews.length === 0 ? (
            <p style={{ textAlign: 'center' }}>등록된 뉴스가 없습니다.</p>
          ) : (
            filteredNews.map((item, index) => {
              const lines = item.summary.split('\n');
              const matchLines = lines.filter((line) => line.includes(targetCompanyName));
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
    </div>
  );
};

export default CompanyInfo;
