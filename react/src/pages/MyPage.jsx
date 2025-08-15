import React, { useRef } from 'react';
import '../CSS/mypage.css'; // 스타일 분리된 CSS 파일

const MyPage = () => {
  const fileInputRef = useRef(null);

  const userInfo = {
    아이디: 'example@email.com (소셜 회원)',
    연락처: 'user@email.com',
    직무: '마케팅',
  };

  const handleProfileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mypage-container" >
      {/* 프로필 */}
      <div className="user-avatar">
        <div className="profile-wrapper" onClick={handleProfileClick}>
          <img
            src="https://static.some.co.kr/sometrend/images/mypage/profile/m_01.png"
            alt="프로필"
            className="profile-image"
          />
          <div className="overlay">프로필 변경</div>
          <input
            type="file"
            ref={fileInputRef}
            accept=".gif, .jpg, .png"
            style={{ display: 'none' }}
          />
        </div>
        <div className="user-name">김유저</div>
      </div>

      <div className="user-info-section">
        <h2>내 정보</h2>

        <table className="info-table">
          <tbody>
            {Object.entries(userInfo).map(([label, value]) => (
              <tr key={label}>
                <td className="info-label">{label}</td>
                <td className="info-value">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="info-buttons">
          <button className="btn-withdraw" onClick={() => alert('회원탈퇴 진행')}>
            회원 탈퇴
          </button>
          <button className="btn-default" onClick={() => alert('문의 페이지로 이동')}>
            문의
          </button>
          <button className="btn-primary" onClick={() => alert('내 정보 관리 페이지로 이동')}>
            내 정보 관리
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
