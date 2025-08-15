// ChatbotButton.jsx
import React, { useState, useEffect, useRef } from "react";
import "./CSS/ChatBot.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "./redux/reducerSlices/companySearchSlice";
import {
  fetchCompaniesByName,
  fetchCompaniesByType,
} from "./redux/reducerSlices/companySearchSlice";
import { Link, useNavigate } from "react-router-dom";
import { fetchCompaniesForChatbot } from "./redux/reducerSlices/chatbotSlice";

const categories = [
  { key: "intro", label: "서비스 소개" },
  { key: "company", label: "기업 정보" },
  { key: "news", label: "뉴스 찾기" },
  { key: "service", label: "서비스 문의" },
];

const Chatbot = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const Base_URL = "http://localhost:8000/api/chatbot";
  const { list, status, keyword } = useSelector(
    (search) => search.companySearch
  ); // 검색결과, 상태, 검색어
  const { companies, searchStatus, searchTerm } = useSelector(
    (state) => state.chatbot
  );

  const [open, setOpen] = useState(false); //창 여닫음
  const [selectedCategory, setSelectedCategory] = useState(null); // 문의사항 선택
  const [input, setInput] = useState("");
  const [confirmModal, setConfirmModal] = useState(false); // 커스텀 모달 상태( 종료 알림창)
  const [showServiceForm, setShowServiceForm] = useState(false); // 서비스 문의 양식 표시
  // 서비스 문의 양식 내용
  const [serviceFormData, setServiceFormData] = useState({
    name: "", //작성자
    title: "",
    purpose: "", //요청 방식
    consultType: "", // 문의 내용
  });

  //챗봇 반응/  대화창에 보여질  대화 문구 state
  const [messages, setMessages] = useState([
    { from: "bot", text: "안녕하세요, NE봇입니다! 무엇을 도와드릴까요?" },
  ]);

  // 스크롤을 위한 ref
  const messagesEndRef = useRef(null);

  // 자동 스크롤 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 메시지가 추가될 때마다 자동 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 카테고리 선택 시에도 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [selectedCategory]);

  // 대화 상태 초기화 함수
  const resetChat = () => {
    setSelectedCategory(null);
    setInput("");
    setShowServiceForm(false); //서비스 문의 창
    setServiceFormData({
      // 서비스 창 내용 초기화.
      name: "",
      title: "",
      consultType: "", // 형식
      purpose: "", //문의 내용
      // agree: false
    });
    setMessages([{ from: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" }]);
  };

  // 닫기 버튼 클릭 시
  const handleClose = () => {
    setConfirmModal(true); // 커스텀 모달 표시
  };

  // confirm창에서 확인 클릭
  const handleConfirmClose = () => {
    setOpen(false);
    resetChat();
    setConfirmModal(false);
  };

  // confirm창에서 취소 클릭
  const handleCancelClose = () => {
    setConfirmModal(false);
  };

  // 이전으로가기 함수
  const handleGoBack = () => {
    if (showServiceForm) {
      // 서비스 폼에서 이전으로 가기
      setShowServiceForm(false);
      setSelectedCategory(null);
      setServiceFormData({
        name: "",
        title: "",
        purpose: "",
        consultType: "",
      });
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "질문 카테고리를 다시 선택해 주세요." },
      ]);
    } else if (selectedCategory) {
      // 카테고리 선택에서 이전으로 가기
      setSelectedCategory(null);
      setInput("");

      // 검색 결과 메시지들을 제거하고 카테고리 선택 메시지만 남기기
      setMessages((prev) => {
        // 검색 결과 메시지들(type: "companyList")을 제거
        const filteredMessages = prev.filter(
          (msg) => msg.type !== "companyList"
        );

        // 마지막 메시지가 검색 결과였다면 카테고리 선택 안내 메시지 추가
        const lastMessage = filteredMessages[filteredMessages.length - 1];
        if (
          lastMessage &&
          lastMessage.from === "bot" &&
          lastMessage.text.includes("관련 기업 정보를 불러오고 있어요")
        ) {
          return [
            ...filteredMessages.slice(0, -1), // 검색 중 메시지도 제거 (카테고리로 와도 검색결과가있음)
            { from: "bot", text: "질문 카테고리를 다시 선택해 주세요." },
          ];
        }

        return filteredMessages;
      });
      // { from: "bot", text: "질문 카테고리를 다시 선택해 주세요." }]
    }
  };

  // 서비스 폼 취소 함수
  const handleCancelServiceForm = () => {
    setShowServiceForm(false);
    setSelectedCategory(null);
    setServiceFormData({
      name: "",
      title: "",
      purpose: "",
      consultType: "",
    });
    setMessages((prev) => [
      ...prev,
      {
        from: "bot",
        text: "문의 양식이 취소되었습니다. 다른 도움이 필요하신가요?",
      },
    ]);
  };
  //

  // 뉴스 데이터 찾기
  const SearchNews = async (company_name) => {
    try {
      const response = await axios.get(
        `${Base_URL}/search/news?company_name=${company_name}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("뉴스 응답:", response); // 데이터 확인용

      if (response.status === 200) {
        const Response = response.data;
        console.log("뉴스 데이터:", Response); // 데이터 구조 확인용
        //articles {}안에  뉴스데이터 목록 있음
        if (
          Response.articles &&
          Array.isArray(Response.articles) &&
          Response.articles.length > 0
        ) {
          // 최신 뉴스 3개만 가져오기
          const latestNews = Response.articles
            .slice(0, 3)
            .map((news, idx) => `${idx + 1}. ${news.title || "제목 없음"}`+` ${news.link}\n`);

        //   const latestNews = Response.articles
        //     .slice(0, 3)
        //     .map((news, idx) => `${idx + 1}. ${news.title || "제목 없음"}\n`+
        //     (news.link.includes('http') ?
        // `<a href="${news.link}" target="_blank" rel="noopener noreferrer">${news.link}</a>` :
        // `<Link to="${news.link}">${news.link}</Link>`)) 내부 링크
          
          setMessages((prev) => [
            ...prev,
            {
              from: "bot",
              type: "newsList",
              data: latestNews,
              // text: `📰 ${company_name}의 최신 뉴스 3개입니다:\n}`,
              text: `📰 ${company_name}의 최신 뉴스 3개입니다:\n\n${latestNews.join("")}`,
            },
          // return(
          //    <></>
          // )
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: "현재 가져올 수 있는 뉴스가 없습니다." },
          ]);
        }
      }
    } catch (error) {
      // console.error('뉴스 정보 가져오기 오류:', error);
      //--------------------

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "죄송합니다. 뉴스 정보를 가져오는 중 오류가 발생했습니다.",
        },
      ]);
    }
  };

  useEffect(() => {
    if (searchStatus === "succeeded" && selectedCategory?.key === "company") {
      const searchList = companies.slice(0, 5); // 상위 5개

      const resultMsg = searchList.map((company, i) => ({
        id: company.id,
        name: company.name,
        display: `${i + 1}. ${company.name}`,
      }));

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          type: "companyList",
          data: resultMsg,
        },
      ]);
    }
  }, [searchStatus]);

  const handleSend = () => {
    if (!input.trim()) return;
    // 입력 방지 (중복 클릭/엔터 방지)
    const currentInput = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { from: "user", text: currentInput }, // 사용자가 입력한  문자로  상태 변경
    ]);

    if (selectedCategory?.key === "company") {
      // dispatch(setSearchTerm(input.trim()));
      // dispatch(fetchCompaniesByName(input.trim()));
      // setMessages((prev) => [...prev, { from: "bot", text: `"${input}" 관련 기업 정보를 불러오고 있어요.` }]);
      dispatch(fetchCompaniesForChatbot(currentInput));
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: `"${currentInput}" 관련 기업 정보를 불러오고 있어요.`,
        },
      ]);
    }
    //뉴스찾기 입력시
    else if (selectedCategory?.key === "news") {
      SearchNews(input.trim()); //  input값 함수에 전달
    }

    setInput(""); //입력창 초기화
  };

  // 질문 카테고리별 선택 후 실행
  const handleCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat.key === "intro") {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: `반갑습니다! 저희 NewsEmo는 AI 기반 기업 여론 분석 시스템입니다.\n| 저희 사이트에서 |
1. 뉴스 기반 감정 및 키워드 분석 \n2. 실제 리뷰 기반 기업 만족도 점수 평가\n3. 기업 랭킹 \n4. 익명 기업 리뷰 시스템 
등, 서비스를 이용하고 인사이트를 제공받아보세요!`,
        },
      ]);
      return
    }

    if(!isAuthenticated) {
      confirm("로그인 후 이용바랍니다") 
      return
    }     
     if (cat.key === "service") {
       setShowServiceForm(true);
       setMessages((prev) => [
        ...prev,
        { from: "bot", text: "서비스 문의 양식을 작성해 주세요." },
      ]);
    } else if (cat.key === "company") {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "검색할 기업 정보를 입력해주세요" },
        ]);
        // handleSend()
      } else if (cat.key === "news") {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
          text: ` ${cat.label} | 어떤 기업의 뉴스를 찾고계시나요?`,
        },
      ]);
    }
      handleSend();
  }
  ;

  const handleServiceFormChange = (field, value) => {
    setServiceFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 서비스 신청 이후
  const handleServiceFormSubmit = async (e) => {
    e.preventDefault();

    // POST 요청으로 서버에 데이터 전송
    console.log("문의 폼:", serviceFormData);
    try {
      const response = await axios.post(
        `${Base_URL}/inquiry`,
        {
          //title 추가
          user_name: serviceFormData.name,
          inquiry_title: serviceFormData.title,
          inquiry_type: serviceFormData.consultType,
          inquiry_content: serviceFormData.purpose,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        setMessages((prev) => [
          ...prev,
          { from: "user", text: "문의 내용을 보냈습니다." },
          { from: "bot", text: response.data.message },
        ]);
        setShowServiceForm(false);
        setSelectedCategory(null);
        // 폼 초기화
        setServiceFormData({
          name: "",
          title: "",
          purpose: "",
          consultType: "",
        });
      }
    } catch (error) {
      // console.error('서비스 문의 제출 오류:', error);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "죄송합니다. 서비스 문의 접수 중 오류가 발생했습니다. 다시 시도해 주세요.",
        },
      ]);
    }
  };

  return (
    <>
      {/* chatbot 버튼 */}
      <button className="chatbot-fab" onClick={() => setOpen((prev) => !prev)}>
        💬
      </button>
      {open && (
        <div className="chatbot-popup">
          <div className="chatbot-header">
            <span>EmoChat</span>

            <div>
              <button onClick={handleClose}>✖</button>
            </div>
          </div>
          <div className="chatbot-body">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.from === "bot" ? "chatbot-msg-bot" : "chatbot-msg-user"
                }
              >
                {msg.text}
              </div>
            ))}

            {/* 스크롤을 위한 빈 div 유지용 */}
            <div ref={messagesEndRef} />

            {/* 선택된 카테고리가 없으면 물어봄 */}
            {!selectedCategory && (
              <div className="chatbot-categories">
                <div style={{ margin: "12px 0 8px 0" }}>
                  질문 카테고리를 선택해 주세요:
                </div>
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    className="chatbot-category-btn"
                    onClick={() => handleCategory(cat)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}

            {/* 기업 검색결과 */}

            {messages.map((msg, idx) => {
              if (msg.type === "companyList") {
                return (
                  <div key={idx} className="chatbot-msg-bot">
                    <div>🔍 검색 결과입니다:</div>
                    {msg.data.map((company) => (
                      <div
                        key={company.id}
                        className="chatbot-result-item"
                        onClick={() => navigate(`/semi/company?company=${company.name}`)}
                        style={{
                          cursor: "pointer",
                          padding: "4px 0",
                          color: "#1f2937",
                        }}
                      >
                        {/* <Link to={`semi/company/${company.id}`}></Link> */}
                        {company.display}
                      </div>
                    ))}
                  </div>
                );
              }
              // else if (msg.type === "newsList") {
              //   return (
              //     <div key={idx} className="chatbot-msg-bot">
              //       <div>{msg.text}</div>
              //       {msg.data.map((news, newsIdx) => (
              //         console.log("뉴스 데이터:", news),
              //         console.log("뉴스 index:", newsIdx),
              //         <div
              //           key={newsIdx}
              //           className="chatbot-news-item"
              //           style={{
              //             padding: "8px 0",
              //             borderBottom: "1px solid #e5e7eb",
              //             marginBottom: "8px"
              //           }}
              //         >
              //           <div style={{ marginBottom: "4px", fontWeight: "500" }}>
              //             {newsIdx + 1}. {news.title || "제목 없음"}
              //           </div>
              //           <div
              //             style={{
              //               color: "#3b82f6",
              //               cursor: "pointer",
              //               textDecoration: "underline",
              //               fontSize: "14px"
              //             }}
              //             onClick={() => window.open(news.link, '_blank')}
              //           >
              //             🔗 뉴스 보러가기
              //           </div>
              //         </div>
              //       ))}
              //     </div>
              //   );
              // }

            })}
            {/* news검색후 링크 */}

            {/* 서비스 문의 양식 */}
            {showServiceForm && (
              <div className="chatbot-service-form">
                <form onSubmit={handleServiceFormSubmit}>
                  {/* <div className="form-group">

                  </div> */}
                  <input
                    type="text"
                    placeholder="작성자이름"
                    value={serviceFormData.name}
                    onChange={(e) =>
                      handleServiceFormChange("name", e.target.value)
                    }
                    required
                  />
                  {/* // 상담 방식 선택 */}

                  <select
                    value={serviceFormData.consultType}
                    onChange={(e) =>
                      handleServiceFormChange("consultType", e.target.value)
                    }
                    className="chatbot-form-select"
                    // required
                  >
                    <option value="">요청방식선택</option>
                    <option value="error">오류신고</option>
                    <option value="improve">기능 개선</option>
                    <option value="etc">기타문의</option>
                  </select>
                  <input
                    placeholder="제목"
                    value={serviceFormData.title}
                    onChange={(e) =>
                      handleServiceFormChange("title", e.target.value)
                    }
                    required
                  />
                  {/* 문의 사항 */}
                  <textarea
                    placeholder="후속 대책 요청 목적을 적어주세요 (예: 사내 갈등 해소 등)"
                    value={serviceFormData.purpose}
                    onChange={(e) =>
                      handleServiceFormChange("purpose", e.target.value)
                    }
                    className="chatbot-form-textarea"
                    required
                  />

                  <div className="chatbot-form-buttons">
                    <button type="submit" className="chatbot-form-submit">
                      신청하기
                    </button>
                    <button
                      type="button"
                      className="chatbot-form-submit"
                      onClick={handleCancelServiceForm}
                    >
                      취소
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* 이전으로가기 버튼 */}
          {(selectedCategory || showServiceForm) && (
            <div className="chatbot-back-button">
              <button onClick={handleGoBack} className="chatbot-back-btn">
                ← 이전으로
              </button>
            </div>
          )}

          {selectedCategory && !showServiceForm && (
            <div className="chatbot-input-area">
              {/* <form onSubmit={(e)=>{
              e.preventDefault()
              handleSend()
            }}> */}

              <input
                type="text"
                placeholder="메시지를 입력하세요..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                // onKeyDown={(e)=>{
                //   if (e.key=== "Enter"){
                //     e.preventDefault()
                //     handleSend()
                //   }
                // }}
              />
              {/* </form> */}
              <button onClick={handleSend}>전송</button>
            </div>
          )}

          {/* 커스텀 확인 모달  / x버튼눌리면 해당 창 실행/*/}
          {confirmModal && (
            <div className="chatbot-confirm-modal">
              <div className="chatbot-confirm-content">
                <h3>챗봇 종료</h3>
                <p>챗봇을 종료하시겠습니까? 대화 내용이 모두 사라집니다.</p>
                <div className="chatbot-confirm-buttons">
                  <button
                    onClick={handleConfirmClose}
                    className="chatbot-confirm-btn confirm"
                  >
                    확인
                  </button>
                  <button
                    onClick={handleCancelClose}
                    className="chatbot-confirm-btn cancel"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
