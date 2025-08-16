import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserProfileThunk } from '../store/userThunk'
import { useNavigate } from 'react-router-dom'
import { useSubscription } from '../../subscription/hooks/useSubscription'
import { checkSubStatThunk } from '../../subscription/store/subscriptionThunk'
import OAuth2LinkSection from '../../auth/components/OAuth2LinkSection'
import UserEditform from '../components/UserEditform'
import WithdrawModal from '../components/WithdrawModal'

const MyPageChatGPT = () => {
  const [activeTab, setActiveTab] = useState('account')
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  
  const user = useSelector((state) => state.user.profile)
  const loading = useSelector((state) => state.user.loading)
  const error = useSelector((state) => state.user.error)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { hasActiveSub } = useSubscription()

  useEffect(() => {
    dispatch(fetchUserProfileThunk())
      .unwrap()
      .catch((err) => {
        console.warn('사용자 정보 조회 실패:', err)
        navigate('/login')
      })
  }, [dispatch])

  useEffect(() => {
    dispatch(checkSubStatThunk())
  }, [dispatch])

  const handleLinkSuccess = () => {
    dispatch(fetchUserProfileThunk())
  }

  if (loading) return <div className="text-center py-10">로딩중...</div>
  if (error) return <div className="text-red-500 text-center py-10">에러: {error}</div>

  const tabs = [
    { id: 'account', label: '계정', icon: '👤' },
    { id: 'profile', label: '프로필', icon: '🎨' },
    { id: 'security', label: '보안', icon: '🔒' },
    { id: 'notifications', label: '알림', icon: '🔔' }
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 왼쪽 탭 메뉴 */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* 닫기 버튼 */}
        <div className="py-3 px-2.5">
          <button 
            className="hover:bg-gray-100 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
            onClick={() => navigate('/')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549L15.3349 14.3652C15.514 14.6369 15.4841 15.006 15.2451 15.2451C15.006 15.4842 14.6368 15.5141 14.3652 15.335L14.2548 15.2451L9.99995 10.9902L5.74506 15.2451C5.4717 15.5185 5.0282 15.5185 4.75483 15.2451C4.48146 14.9718 4.48146 14.5282 4.75483 14.2549L9.00971 10L4.75483 5.74512L4.66499 5.63477C4.48589 5.3631 4.51575 4.99396 4.75483 4.75488C4.99391 4.51581 5.36305 4.48594 5.63471 4.66504L5.74506 4.75488L9.99995 9.00977L14.2548 4.75488Z" />
            </svg>
          </button>
        </div>

        {/* 탭 버튼들 */}
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-gray-100 transition-colors ${
              activeTab === tab.id ? 'bg-gray-100 border-r-2 border-blue-500' : ''
            }`}
          >
            <div className="flex items-center justify-center w-5 h-5">
              <span className="text-lg">{tab.icon}</span>
            </div>
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 오른쪽 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {/* 계정 탭 */}
        {activeTab === 'account' && (
          <div className="p-6">
            <section className="mb-4">
              <h3 className="text-lg font-normal border-b border-gray-200 py-3 mb-4">계정</h3>
              
              {/* 구독 정보 */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <div className="font-medium">NewsEmo Plus</div>
                  <div className="text-sm text-gray-500">2025년 8월 30일 자동 갱신</div>
                </div>
                <button 
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  onClick={() => navigate('/subscription-management')}
                >
                  관리
                </button>
              </div>

              {/* 결제 */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <div>결제</div>
                  <a href="#" className="text-blue-600 text-xs">결제에 도움이 필요하신가요?</a>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  관리
                </button>
              </div>

              {/* 계정 삭제 */}
              <div className="flex items-center justify-between py-4">
                <div>계정 삭제하기</div>
                <button 
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors"
                  onClick={() => setWithdrawOpen(true)}
                >
                  삭제
                </button>
              </div>
            </section>
          </div>
        )}

        {/* 프로필 탭 */}
        {activeTab === 'profile' && (
          <div className="p-6">
            <section className="mb-4">
              <h3 className="text-lg font-normal border-b border-gray-200 py-3 mb-4">GPT 빌더 프로필</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  GPT 사용자와 연결하려면 빌더 프로필을 개인 맞춤 설정하세요. 이 설정은 공개적으로 공유된 GPT에 적용됩니다.
                </p>
                
                {/* 프로필 카드 */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-sm">👤</span>
                    </div>
                    <div>
                      <div className="font-semibold">{user?.nickname || '사용자'}</div>
                      <div className="text-sm text-gray-500">작성자: {user?.email}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 소셜 링크 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span>Google</span>
                  </div>
                  <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50 transition-colors">
                    추가하기
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span>Kakao</span>
                  </div>
                  <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50 transition-colors">
                    추가하기
                  </button>
                </div>
              </div>

              {/* 사용자 정보 수정 */}
              <div className="mt-6">
                <UserEditform />
              </div>
            </section>
          </div>
        )}

        {/* 보안 탭 */}
        {activeTab === 'security' && (
          <div className="p-6">
            <section className="mb-4">
              <h3 className="text-lg font-normal border-b border-gray-200 py-3 mb-4">보안</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium">2단계 인증</div>
                    <div className="text-sm text-gray-500">계정 보안을 강화하세요</div>
                  </div>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    설정
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium">로그인 활동</div>
                    <div className="text-sm text-gray-500">최근 로그인 기록을 확인하세요</div>
                  </div>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    보기
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 알림 탭 */}
        {activeTab === 'notifications' && (
          <div className="p-6">
            <section className="mb-4">
              <h3 className="text-lg font-normal border-b border-gray-200 py-3 mb-4">알림</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium">이메일 알림</div>
                    <div className="text-sm text-gray-500">중요한 업데이트를 이메일로 받으세요</div>
                  </div>
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium">푸시 알림</div>
                    <div className="text-sm text-gray-500">브라우저 푸시 알림을 받으세요</div>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* 회원탈퇴 모달 */}
      <WithdrawModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        requirePassword={true}
      />
    </div>
  )
}

export default MyPageChatGPT
