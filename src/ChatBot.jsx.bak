// ChatbotButton.jsx
import React, { useState, useEffect, useRef } from "react";
import "./CSS/ChatBot.css";
import axios from "axios";

const categories = [
  { key: "company", label: "기업 정보" },
  { key: "news", label: "뉴스" },
  { key: "service", label: "서비스 문의" },
];

const Chatbot = () => {
  const [open, setOpen] = useState(false);   //창 여닫음
  const [selectedCategory, setSelectedCategory] = useState(null);  // 문의사항 선택
  const [input, setInput] = useState("");
  const [confirmModal, setConfirmModal] = useState(false); // 커스텀 모달 상태( 종료 알림창)
  const [showServiceForm, setShowServiceForm] = useState(false); // 서비스 문의 양식 표시
  // 서비스 문의 양식 내용
  const [serviceFormData, setServiceFormData] = useState({ 
    
    purpose: "",
    // file: null,
    consultType: "",
    // agree: false
  });
  const Base_URL= "http://localhost:8000"
  //챗봇 반응
  const [messages, setMessages] = useState([   
    { from: "bot", text: "안녕하세요, NE봇입니다! 무엇을 도와드릴까요?" }
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

  // 대화 상태 초기화 함수
  const resetChat = () => {
    setSelectedCategory(null);
    setInput("");
    setShowServiceForm(false);  //서비스 문의 창
    setServiceFormData({      // 서비스 창 내용 초기화
      // name: "",
      // email: "",
      // company: "",
      // file: null,
      // consultationType: "",
      consultType: "",
      purpose: "",
      // agree: false
    });
    setMessages([
      { from: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" }
    ]);
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
        purpose: "",
        consultType: "",
      });
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "질문 카테고리를 다시 선택해 주세요." }
      ]);
    } else if (selectedCategory) {
      // 카테고리 선택에서 이전으로 가기
      setSelectedCategory(null);
      setInput("");
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "질문 카테고리를 다시 선택해 주세요." }
      ]);
    }
  };

  // 서비스 폼 취소 함수
  const handleCancelServiceForm = () => {
    setShowServiceForm(false);
    setSelectedCategory(null);
    setServiceFormData({
      purpose: "",
      consultType: "",
    });
    setMessages((prev) => [
      ...prev,
      { from: "bot", text: "문의 양식이 취소되었습니다. 다른 도움이 필요하시면 말씀해 주세요." }
    ]);
  };

  const handleCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat.key === "service") {
      setShowServiceForm(true);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "서비스 문의 양식을 작성해 주세요." }
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: ` 궁금한 "${cat.label}"내용을 입력해 주세요.` }
      ]);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: "user", text: input }
    ]);
    setInput("");
    // 실제 챗봇 응답 로직은 여기에 추가
  };

  const handleServiceFormChange = (field, value) => {
    setServiceFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 서비스 신청 이후
  const handleServiceFormSubmit = async (e) => {
    e.preventDefault();
    
    // try {
      // FormData 객체 생성 ( 문의 신청 받은 데이터 넣음)  파일 첨부가 있을 경우 사용
      // const formData = new FormData();
      // formData.append('company', serviceFormData.company);
      // formData.append('consultationType', serviceFormData.consultationType);
      // formData.append('purpose', serviceFormData.purpose);
      // formData.append('agree', serviceFormData.agree);
      
      // //첨부파일 있으면  추가
      // if (serviceFormData.file) {
      //   formData.append('file', serviceFormData.file);
      // }

      // POST 요청으로 서버에 데이터 전송
      console.log("문의 폼:",serviceFormData)
      try{
        const response= await axios.post(`${Base_URL}/api/chatbot/inquiry`,{
          inquiry_type: serviceFormData.consultType,
          inquiry_content: serviceFormData.purpose
        },{
          headers: {'Content-Type': 'application/json'}
        })
        
        if (response.status === 200) {
          setMessages((prev) => [
            ...prev,
            { from: "user", text: "문의 내용을 보냈습니다." },
            { from: "bot", text: response.data.message }
          ]);
          setShowServiceForm(false);
          setSelectedCategory(null);
          // 폼 초기화
          setServiceFormData({
            
            purpose: "",
            consultType: "",
          
          });
        }
    } catch (error) {
      console.error('서비스 문의 제출 오류:', error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "죄송합니다. 서비스 문의 접수 중 오류가 발생했습니다. 다시 시도해 주세요." }
      ]);
    }
  };

  return (
    <>
      <button
        className="chatbot-fab"
        onClick={() => setOpen((prev) => !prev)}
      >
        💬
      </button>
      {open && (
        <div className="chatbot-popup">
          <div className="chatbot-header">
            <span>EmoChat</span>

            <div>
            <button onClick={handleClose}  >✖</button>
            </div>
          </div>
          <div className="chatbot-body">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={msg.from === "bot" ? "chatbot-msg-bot" : "chatbot-msg-user"}
              >
                {msg.text}
              </div>
            ))}
            {/* 스크롤을 위한 빈 div */}
            <div ref={messagesEndRef} />
            {/* 선택된 카테고리가 없으면 물어봄 */}
            {!selectedCategory && (
              <div className="chatbot-categories">
                <div style={{ margin: "12px 0 8px 0" }}>질문 카테고리를 선택해 주세요:</div>
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
            
            {/* 서비스 문의 양식 */}
            {showServiceForm && (
              <div className="chatbot-service-form">
                <form onSubmit={handleServiceFormSubmit}>
                  <div className="form-group">
                    {/* <input
                      type="text"
                      placeholder="이름"
                      value={serviceFormData.name}
                      onChange={(e) => handleServiceFormChange('name', e.target.value)}
                      className="chatbot-form-input"
                      required
                    /> */}
                    {/* <input
                      type="email"
                      placeholder="이메일"
                      value={serviceFormData.email}
                      onChange={(e) => handleServiceFormChange('email', e.target.value)}
                      className="chatbot-form-input"
                      required
                    /> */}
                    {/* 문의할 회사명 입력 */}
                    {/* <input
                      type="text"
                      placeholder="회사명"
                      value={serviceFormData.company}
                      onChange={(e) => handleServiceFormChange('company', e.target.value)}
                      className="chatbot-form-input"
                      // required
                    /> */}
                  </div>
                  {/* // 상담 방식 선택 */}
                  <select
                    value={serviceFormData.consultType}
                    onChange={(e) => handleServiceFormChange('consultType', e.target.value)}
                    className="chatbot-form-select"
                    // required
                  >
                    <option value="">희망 상담 방식 선택</option>
                    <option value="email">이메일 보고서</option>
                    <option value="online">온라인 미팅</option>
                    <option value="offline">오프라인 컨설팅</option>
                  </select>
                   {/* 문의 사항 */}
                  <textarea
                    placeholder="후속 대책 요청 목적을 적어주세요 (예: 사내 갈등 해소 등)"
                    value={serviceFormData.purpose}
                    onChange={(e) => handleServiceFormChange('purpose', e.target.value)}
                    className="chatbot-form-textarea"
                    required
                  />
                  {/* 분석파일 첨부 다운로드 받은 파일이 있거나 할때
                  <div className="form-group">
                    <label className="chatbot-form-label">분석 리포트 파일 (선택)</label>
                    <input
                      type="file"
                      onChange={(e) => handleServiceFormChange('file', e.target.files[0])}
                      className="chatbot-form-file"
                    />
                  </div> */}
                  
                 
                  
                  {/* <div className="form-group checkbox-group">
                    <input
                      type="checkbox"
                      checked={serviceFormData.agree}
                      onChange={(e) => handleServiceFormChange('agree', e.target.checked)}
                      className="chatbot-form-checkbox"
                      required
                    />
                    <label className="chatbot-form-checkbox-label">
                      개인정보 수집 및 이용에 동의합니다.
                    </label>
                  </div> */}
                  
                  <div className="chatbot-form-buttons">
                    <button type="submit" className="chatbot-form-submit">
                      요청하기
                    </button>
                    {/* <button 
                      type="button" 
                      className="chatbot-form-submit"
                      onClick={handleCancelServiceForm}
                    >
                      취소
                    </button> */}
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
            <input
              type="text"
              placeholder="메시지를 입력하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              />
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
                  <button onClick={handleConfirmClose} className="chatbot-confirm-btn confirm">
                    확인
                  </button>
                  <button onClick={handleCancelClose} className="chatbot-confirm-btn cancel">
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