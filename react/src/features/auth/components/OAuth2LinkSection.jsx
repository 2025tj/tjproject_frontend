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

  const getProviderInfo = (provider) => {
    const providerInfo = {
      google: {
        name: 'Google',
        color: 'bg-red-500 hover:bg-red-600',
        // icon: '🔍',
        description: 'Google 계정으로 로그인'
      },
      kakao: {
        name: 'Kakao',
        color: 'bg-yellow-400 hover:bg-yellow-500',
        // icon: '💬',
        description: 'Kakao 계정으로 로그인'
      }
    };
    return providerInfo[provider] || { name: provider, color: 'bg-gray-500', icon: '��' };
  };
    
  // const closeModal = () => {
  //   setModalOpen(false);
  //   setSelectedProvider(null);
  // };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-token-text-primary mb-4">소셜 계정 연동</h3>
      <div className="space-y-3">
        {supportedProviders.map((provider) => {
          const isLinked = linkedProviders.includes(provider);
          const providerInfo = getProviderInfo(provider);
          return (
            <div key={provider} className="flex items-center justify-between p-4 bg-token-main-surface-secondary rounded-lg border border-token-border-light">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{providerInfo.icon}</div>
                <div>
                  <h4 className="font-medium text-token-text-primary">{providerInfo.name}</h4>
                  <p className="text-sm text-token-text-secondary">{providerInfo.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {isLinked ? (
                  <>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-token-surface-success text-token-text-success">
                      연동됨
                    </span>
                    <button 
                      onClick={() => handleSocialUnlink(provider)} 
                      disabled={isProcessing}
                      className="px-3 py-1.5 text-sm text-token-text-error bg-white border border-token-border-light rounded-md hover:bg-token-main-surface-secondary transition-colors disabled:opacity-50"
                    >
                      연동해제
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleSocialLink(provider)} 
                    disabled={isProcessing}
                    className={`px-4 py-2 text-sm text-white rounded-md transition-colors disabled:opacity-50 ${providerInfo.color}`}
                  >
                    {isProcessing ? '처리중...' : '연동하기'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* <div className="mt-4 p-3 bg-token-main-surface-secondary rounded-lg">
        <p className="text-sm text-token-text-secondary">
          소셜 계정을 연동하면 더 안전하고 편리하게 서비스를 이용할 수 있습니다.
        </p>
      </div> */}

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
