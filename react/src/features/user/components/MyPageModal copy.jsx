import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import { api } from '@shared/utils/api'
import { Link, useNavigate } from 'react-router-dom'
import UserEditform from './UserEditform'
import OAuth2LinkSection from '../../auth/components/OAuth2LinkSection'
import { fetchUserProfileThunk} from '../store/userThunk'
import { useDispatch, useSelector } from 'react-redux'
import { emailService } from '../../email/services/emailService'
import { useSubscription } from '../../subscription/hooks/useSubscription'
import { checkSubStatThunk } from '../../subscription/store/subscriptionThunk'
import WithdrawModal from './WithdrawModal'

const MyPageModal = ({ open, onClose }) => {
  const user = useSelector((state) => state.user.profile)
  const loading = useSelector((state) => state.user.loading)
  const error = useSelector((state) => state.user.error)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [activeTab, setActiveTab] = useState('account')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { hasActiveSub } = useSubscription()
  const [withdrawOpen, setWithdrawOpen] = useState(false)

  useEffect(() => {
    if (open) {
      dispatch(fetchUserProfileThunk())
        .unwrap()
        .catch((err) => {
          console.warn('사용자 정보 조회 실패:', err)
          onClose()
        })
    }
  }, [open, dispatch])

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  useEffect(() => {
    if (open) {
      dispatch(checkSubStatThunk())
    }
  }, [open, dispatch])

  const handleLinkSuccess = () => {
    dispatch(fetchUserProfileThunk())
  }

  const handleResendVerification = async () => {
    if (resendLoading || resendCooldown > 0) return
    setResendLoading(true)
    try {
      await emailService.resendVerification()
      alert('인증 메일이 재발송되었습니다. 이메일을 확인해주세요.')
      setResendCooldown(60)
    } catch (error) {
      const errorMessage = error.response?.data || '재발송에 실패했습니다.'
      alert(errorMessage)
    } finally {
      setResendLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm text-gray-600 mb-1">이메일</h4>
              <p className="text-base">{user?.email || '없음'}</p>
            </div>

            <div>
              <h4 className="text-sm text-gray-600 mb-1">이메일 인증</h4>
              {user?.emailVerified ? (
                <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded">인증됨</span>
              ) : (
                <div className="text-sm text-red-500">
                  인증되지 않음
                  <button
                    onClick={handleResendVerification}
                    disabled={resendLoading || resendCooldown > 0}
                    className="ml-2 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs"
                  >
                    {resendCooldown > 0 ? `재발송 (${resendCooldown})` : '인증 메일 재발송'}
                  </button>
                </div>
              )}
            </div>

            <OAuth2LinkSection onLinkSuccess={handleLinkSuccess}/>
            <UserEditform />

            <div className="pt-10 text-right">
              <button
                type='button'
                className='text-red-600 hover:underline'
                onClick={() => setWithdrawOpen(true)}
              >
                회원탈퇴 →
              </button>
            </div>
            <WithdrawModal
              open={withdrawOpen}
              onClose={()=>setWithdrawOpen(false)}
              requirePassword={true}
            />
          </div>
        )
      
      // case 'payment':
      //   return (
      //     <div className="space-y-6">
      //       <div className="border-t pt-6">
      //         <h3 className="text-xl font-semibold mb-3">결제 정보</h3>
      //         <div className="space-y-4">
      //           <div className="p-4 bg-gray-50 rounded-lg">
      //             <h4 className="font-medium mb-2">결제 수단</h4>
      //             <p className="text-sm text-gray-600">등록된 결제 수단이 없습니다.</p>
      //             <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
      //               결제 수단 추가
      //             </button>
      //           </div>
                
      //           <div className="p-4 bg-gray-50 rounded-lg">
      //             <h4 className="font-medium mb-2">결제 내역</h4>
      //             <p className="text-sm text-gray-600">결제 내역이 없습니다.</p>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   )
      
      case 'subscription':
        return (
          <div className="space-y-6">
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-3">구독 정보</h3>
              <div className="flex items-center justify-between">
                <div className="text-gray-500">
                  {hasActiveSub ? '구독중입니다.' : '구독중인 서비스가 없습니다.'}
                </div>
                <button
                  className="px-3 py-2 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  onClick={() => navigate(hasActiveSub ? '/subscription/manage' : '/subscription')}
                >
                  {hasActiveSub ? '구독 관리' : '구독 하러가기'}
                </button>
              </div>
              
              {hasActiveSub && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">구독 상세 정보</h4>
                  <p className="text-sm text-green-700">구독 기간: 2024.01.01 ~ 2024.12.31</p>
                  <p className="text-sm text-green-700">구독 요금: 월 29,000원</p>
                </div>
              )}
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  if (loading) return (
    <Modal
      title="마이페이지"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={800}
    >
      <div className="text-center py-10">로딩중...</div>
    </Modal>
  )

  if (error) return (
    <Modal
      title="마이페이지"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={800}
    >
      <div className="text-red-500 text-center py-10">에러: {error}</div>
    </Modal>
  )

  return (
    <>
      <Modal
        title="마이페이지"
        open={open}
        onCancel={handleClose}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        <main className="flex gap-6">
          {/*왼쪽 네비게이션 메뉴 */}
          <div className="w-64 flex-shrink-0">
            <div className="flex flex-col items-center space-y-3 mb-6">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'account'
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">계정</span>
                  </div>
                </button>
                
                {/* <button
                  onClick={() => setActiveTab('payment')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'payment'
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">결제</span>
                  </div>
                </button> */}
                
                <button
                  onClick={() => setActiveTab('subscription')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'subscription'
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">구독</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* 오른쪽 콘텐츠 영역 */}
          <div className="flex-1">
            {/* 이메일 인증 필요 섹션 */}
            {user && !user.emailVerified && (
              <div className="w-full">
                <h2>이메일 인증 필요</h2>
                <p>계정을 안전하게 사용하기 위해 이메일 인증을 완료해주세요.</p>
                <button 
                    onClick={handleResendVerification}
                    disabled={resendLoading || resendCooldown > 0}
                >
                    {resendLoading
                        ? '발송 중...'
                        : resendCooldown > 0
                        ? `재발송 (${resendCooldown}초 후)`
                        : '인증 메일 재발송'}
                </button>
                <button onClick={() => dispatch(fetchUserProfileThunk())}>
                    새로고침
                </button>
                {resendCooldown > 0 && (
                  <p style={{ 
                      color: '#856404', 
                      fontSize: '14px', 
                      marginTop: '10px',
                      marginBottom: 0 
                  }}>
                    스팸 방지를 위해 잠시 후 다시 시도해주세요.
                  </p>
                )}
              </div>
            )}
            {/*이메일 인증 완료 섹션 */}
            {user && user.emailVerified && (
              <article>
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {activeTab === 'account' && '계정 정보'}
                    {/* {activeTab === 'payment' && '결제 관리'} */}
                    {activeTab === 'subscription' && '구독 관리'}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {activeTab === 'account' && '계정 정보를 확인하고 수정할 수 있습니다.'}
                    {/* {activeTab === 'payment' && '결제 수단과 결제 내역을 관리할 수 있습니다.'} */}
                    {activeTab === 'subscription' && '구독 상태와 구독 정보를 확인할 수 있습니다.'}
                  </p>
                </div>

                {renderTabContent()}
              </article>
            )}
            {/* {user && user.emailVerified && (
              <>
            <section className="flex-1">
              <article>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">내 정보</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm text-gray-600 mb-1">이메일</h4>
                    <p className="text-base">{user?.email || '없음'}</p>
                  </div>

                  <div>
                    <h4 className="text-sm text-gray-600 mb-1">이메일 인증</h4>
                    {user?.emailVerified ? (
                      <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded">인증됨</span>
                    ) : (
                      <div className="text-sm text-red-500">
                        인증되지 않음
                        <button
                          onClick={handleResendVerification}
                          disabled={resendLoading || resendCooldown > 0}
                          className="ml-2 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs"
                        >
                          {resendCooldown > 0 ? `재발송 (${resendCooldown})` : '인증 메일 재발송'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="text-xl font-semibold mb-3">구독 정보</h3>
                    <div className="flex items-center justify-between">
                      <div className="text-gray-500">
                        {hasActiveSub ? '구독중입니다.' : '구독중인 서비스가 없습니다.'}
                      </div>
                      <button
                        className="px-3 py-2 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600"
                        onClick={() => navigate(hasActiveSub ? '/subscription/manage' : '/subscription')}
                      >
                        {hasActiveSub ? '구독 관리' : '구독 하러가기'}
                      </button>
                    </div>
                  </div>

                  <OAuth2LinkSection onLinkSuccess={handleLinkSuccess}/>
                  <UserEditform />

                  <div className="pt-10 text-right">
                    <button
                      type='button'
                      className='text-red-600 hover:underline'
                      onClick={() => setWithdrawOpen(true)}
                    >
                      회원탈퇴 →
                    </button>
                  </div>
                  <WithdrawModal
                    open={withdrawOpen}
                    onClose={()=>setWithdrawOpen(false)}
                    requirePassword={true}
                  />
                </div>
                </article>
              </section>
              </>
              )} */}
          </div>
          
        </main>
      </Modal>
    </>
  )
}

export default MyPageModal