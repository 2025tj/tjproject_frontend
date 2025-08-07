import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const OAuth2LinkComplete = () => {
  const [searchParams] = useSearchParams();
  const provider = searchParams.get('provider');
  // const { provider } = useParams();

  useEffect(() => {
    // 모달(iframe) 내부에서 실행되는 경우
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'SOCIAL_LINK_SUCCESS',
        provider: provider
      }, '*');
    }
    // 팝업에서 실행되는 경우 (기존 방식 유지)
    else if (window.opener) {
      window.opener.postMessage({
        type: 'SOCIAL_LINK_SUCCESS',
        provider: provider
      }, '*');

      setTimeout(() => {
        window.close();
      }, 500);
    }
    // 직접 접근한 경우
    else {
      setTimeout(() => {
        window.location.href = '/mypage';
      }, 2000);
    }
  }, [provider]);
  return (
    <div>
      <h1>연동 완료!</h1>
      <p>{provider} 계정이 연동되었습니다.</p>
      <p>{window.opener ? '창이 닫힙니다...' : '마이페이지로 이동합니다...'}</p>
    </div>
  )
}

export default OAuth2LinkComplete
