import React, { useState, useEffect } from 'react';
import { userService } from '@features/user/services/userService'
import Modal from '@shared/components/ui/Modal/Modal';
// import OAuth2LoginModal from '../../../components/modals/OAuth2LinkModal';
// import OAuth2LinkModal from '../../../components/modals/OAuth2LinkModal';
import { getAccessToken } from '../utils';

const OAuth2LinkSection = ({ onLinkSuccess }) => {
  const [linkedProviders, setLinkedProviders] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const supportedProviders = ['google', 'kakao'];

  useEffect(() => {
        fetchLinkedProviders();
    }, []);

  const fetchLinkedProviders = async () => {
    try {
      const data = await userService.getLinkedProviders();
      console.log('Section/getLinkedProviders(): ', data)
      setLinkedProviders(data); 
    } catch (error) {
      console.error('연동된 계정 조회 실패:', error);
    }
  };

  const handleSocialLink = (provider) => {
    const accessToken = getAccessToken()
    if (!accessToken) {
      alert('로그인이 필요합니다.')
      return
    }

    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    // const popup = window.open(
    //   `http://localhost:8080/oauth2/authorization/google?redirect_uri=${encodeURIComponent('http://localhost:8080/oauth2/login/google?mode=link')}`,
    //   'socialLink',
    //   'width=600,height=700'
    // );


    const popup = window.open(
      `http://localhost:8080/oauth2/authorization/${provider}?mode=link&token=${encodeURIComponent(accessToken)}`,
      // `http://localhost:8080/oauth2/authorization/${provider}?state=mode=link`,
      //  `http://localhost:8080/oauth2/authorization/google?redirect_uri=http://localhost:8080/oauth2/login/google?mode=link`,
      'socialLink',
      `width=${width},height=${height},top=${top},left=${left}`
    )

    const listener = (event) => {
      if (event.origin !== 'http://localhost:5173') return

      if (event.data?.type === 'SOCIAL_LINK_SUCCESS') {
        // alert(`${event.data.provider} 계정 연동 완료`)

        if (onLinkSuccess) {
          onLinkSuccess()
        }

        fetchLinkedProviders()
      } else if (event.data?.type === 'SOCIAL_LINK_FAIL') {
        alert(`연동 실패: ${event.data.reason}`)
      }

      // try {
      //   if (popup && !popup.closed) {
      //     popup.close()
      //   }
      // } catch (error) {
      //   console.log('팝업 닫기 실패 (정상적인 보안 정책):', error)
      // }
      window.removeEventListener('message', listener)
    }
    window.addEventListener('message', listener)
  }

  // const handleSocialLink = (provider) => {
  //   // 모달 대신 현재 창에서 OAuth2 페이지로 이동
  //   // 연동 완료 후 다시 마이페이지로 돌아옴
  //   window.location.href = `http://localhost:8080/oauth2/authorization/${provider}?mode=link`;
  // };

  // const handleSocialLink = (provider) => {
  //   setIsProcessing(provider);
  //   setModalOpen(true);
  // };

  // const handleLinkSuccess = (provider) => {
  //   alert(`${provider} 계정 연동 완료!`);
  //   fetchLinkedProviders();
  //   setModalOpen(false);
  //   setSelectedProvider(null);
  // };

  // const handleLinkError = () => {
  //   alert('소셜 계정 연동 실패');
  //   setModalOpen(false);
  //   setSelectedProvider(null);
  // };
      
  const handleSocialUnlink = async (provider) => {
    if (!confirm(`${provider} 계정 연동을 해제하시겠습니까?`)) return;

    try {
      await userService.unlinkSocial(provider);
      alert('연동이 해제되었습니다.');
      fetchLinkedProviders();
    } catch (error) {
      alert('연동 해제 실패');
    }
  };
    
  // const closeModal = () => {
  //   setModalOpen(false);
  //   setSelectedProvider(null);
  // };

  return (
    <div>
      <h2>소셜 계정 연동</h2>
      {supportedProviders.map((provider) => {
        const isLinked = linkedProviders.includes(provider);
        return (
          <div key={provider}>
            <span>{provider}: {isLinked ? '연동됨' : '연동안됨'}</span>
            {isLinked ? (
              <button onClick={() => handleSocialUnlink(provider)} disabled={isProcessing}>
                연동해제
              </button>
            ) : (
              <button onClick={() => handleSocialLink(provider)} disabled={isProcessing}>
                {isProcessing ? '처리중...' : '연동하기'}
              </button>
            )}
          </div>
        );
      })}

      {/* <Modal isOpen={modalOpen} onClose={closeModal}>
        <OAuth2LinkModal
          provider={selectedProvider}
          onSuccess={handleLinkSuccess}
          onError={handleLinkError}
          onClose={closeModal}
        />
      </Modal> */}

    </div>
  )
}

export default OAuth2LinkSection
