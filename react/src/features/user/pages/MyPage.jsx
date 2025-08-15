import React, { useEffect, useState } from 'react'
import { api } from '@shared/utils/api'
import { Link, useNavigate } from 'react-router-dom'
import UserEditform from '../components/UserEditform'
import OAuth2LinkSection from '../../auth/components/OAuth2LinkSection'
import { fetchUserProfileThunk} from '../store/userThunk'
import { useDispatch, useSelector } from 'react-redux'
import { emailService } from '../../email/services/emailService'
import { useSubscription } from '../../subscription/hooks/useSubscription'
import { checkSubStatThunk } from '../../subscription/store/subscriptionThunk'
import WithdrawModal from '../components/WithdrawModal'

const MyPage = () => {
  const user = useSelector((state) => state.user.profile)
  const loading = useSelector((state) => state.user.loading)
  const error = useSelector((state) => state.user.error)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { hasActiveSub } = useSubscription()
  const [isOpen, setIsOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)


  useEffect(() => {
    dispatch(fetchUserProfileThunk())
      .unwrap()
      .catch((err) => {
        console.warn('사용자 정보 조회 실패:', err)
        navigate('/login')
      })
  }, [dispatch])

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  useEffect(() => {
    dispatch(checkSubStatThunk())
  }, [dispatch])

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

  if (loading) return <div className="text-center py-10">로딩중...</div>
  if (error) return <div className="text-red-500 text-center py-10">에러: {error}</div>

  return (
    <main className="flex flex-col sm:flex-row gap-6 max-w-6xl mx-auto p-6">
      {/*이메일 인증 필요 섹션 */}
      {user &&! user.emailVerified && (
        <div>
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
        <>
        <section className="w-full sm:w-64 flex-shrink-0">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative w-28 h-28 rounded-full overflow-hidden">
            <img
              src="https://static.some.co.kr/sometrend/images/mypage/profile/w_03.png"
              alt="프로필"
              className="w-full h-full object-cover"
            />
            <label
              htmlFor="upload-avatar"
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 hover:opacity-100 cursor-pointer transition"
            >
              <span className="text-xl">📷</span>
              <div className="text-sm">프로필 변경</div>
              <input
                type="file"
                id="upload-avatar"
                accept=".gif, .jpg, .png"
                className="hidden"
              />
            </label>
          </div>

          <div className="text-center">
            <div className="font-semibold text-lg">{user?.nickname || '닉네임 없음'}</div>
            <div className="text-sm text-gray-500 mt-1">{user?.roles?.join(', ') || '직무 없음'}</div>
          </div>

          <div className="flex flex-col items-center w-full mt-6 gap-2">
            <button
              className="w-1/2 py-2 bg-white text-gray-800 rounded hover:bg-black hover:text-white text-sm font-semibold transition-colors duration-200"
              onClick={() => navigate('/subscription-management')}
            >
              구독관리
            </button>
            <button
              className="w-1/2 py-2 bg-white text-gray-800 rounded hover:bg-black hover:text-white text-sm font-semibold transition-colors duration-200"
              onClick={() => navigate('/inquiry')}
            >
              1:1문의
            </button>
          </div>
        </div>
      </section>

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
              <div>
                <h4 className="text-sm text-gray-600 mb-1">권한</h4>
                <p className="text-base">{user?.roles?.join(', ') || '직무 없음'}</p>
              </div>
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

            <OAuth2LinkSection />
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
      )}
    </main>
  )
}

export default MyPage
