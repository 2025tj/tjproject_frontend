import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PLAN_TYPES, PLAN_INFO } from '@features/subscription/services/subscriptionService';
import { clearError, clearSuccessMessage, setSubscriptionActive } from '@features/subscription/store/subscriptionSlice';
import { checkSubStatThunk } from '@features/subscription/store/subscriptionThunk';
import { api } from '../../../shared/utils/api';

const SubscriptionPlans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    isActive,
    createLoading,
    createError,
    successMessage
  } = useSelector((state) => state.subscription);
  const [selectedPlan, setSelectedPlan] = useState(PLAN_TYPES.MONTHLY);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(PLAN_TYPES.MONTHLY);

  useEffect(() => {
    dispatch(checkSubStatThunk());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
        navigate('/subscription/manage');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch, navigate]);

  const handlePlanSelect = () => {
    setSelectedPlan(selectedTab);
    setShowConfirm(true);
  };

  const generateMerchantUid = () => `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const handlePay = () => {
    if (!selectedPlan) return;
    const IMP = window.IMP;
    IMP.init('imp75507553');

    const merchantUid = generateMerchantUid();
    const planInfo = PLAN_INFO[selectedPlan];
    setLoading(true);

    IMP.request_pay(
      {
        pg: 'uplus',
        pay_method: 'card',
        merchant_uid: merchantUid,
        name: `${planInfo.name} 구독 결제`,
        amount: planInfo.price,
        buyer_email: 'chlorella71@naver.com',
        buyer_name: 'chlorella71',
      },
      async (rsp) => {
        if (rsp.success) {
          try {
            const res = await api.post('/payment/complete', {
              impUid: rsp.imp_uid,
              merchantUid: rsp.merchant_uid,
              amount: rsp.paid_amount,
              planType: selectedPlan.toUpperCase(),
            });
            const subscription = res.data.subscription;
            dispatch(setSubscriptionActive(subscription));
            alert('결제가 완료되었습니다.');
            navigate('/subscription/manage');
          } catch (err) {
            alert('서버 결제 처리에 실패했습니다.');
          } finally {
            setLoading(false);
            setShowConfirm(false);
          }
        } else {
          alert('결제 실패: ' + rsp.error_msg);
          setLoading(false);
        }
      }
    );
  };

  const formatPrice = (price) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);

  if (isActive) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-2">이미 구독 중입니다</h2>
        <p className="text-gray-600 mb-4">현재 활성화된 구독이 있습니다.</p>
        <button
          onClick={() => navigate('/subscription/manage')}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          구독 관리하기
        </button>
      </div>
    );
  }

  const getPaymentDate = () => {
    const today = new Date();
    const paymentDate = new Date(today);
    paymentDate.setDate(today.getDate() + 30);
    return paymentDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const planInfo = PLAN_INFO[selectedTab];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">구독 플랜 선택</h1>
        <p className="text-gray-600">NewsEmo의 모든 기능을 이용하세요</p>
      </div>

      {successMessage && <div className="text-green-600 text-center mb-4">{successMessage}</div>}
      {createError && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex justify-between">
          <span>{createError}</span>
          <button onClick={() => dispatch(clearError())}>×</button>
        </div>
      )}

      <div className="flex justify-center mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedTab(PLAN_TYPES.MONTHLY)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              selectedTab === PLAN_TYPES.MONTHLY
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            월간
          </button>
          <button
            onClick={() => setSelectedTab(PLAN_TYPES.YEARLY)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              selectedTab === PLAN_TYPES.YEARLY
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            연간
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{planInfo.name}</h3>
        <div className="text-lg font-semibold text-gray-700 mb-3">
          {formatPrice(planInfo.price)}
          <span className="text-sm text-gray-500"> / {planInfo.duration}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{planInfo.description}</p>
        <ul className="list-disc list-inside text-sm text-gray-700 mb-4 text-left">
          <li>모든 기능 이용 가능</li>
          <li>무제한 검색</li>
          <li>고객 지원</li>
          {selectedTab === PLAN_TYPES.YEARLY && <li>2개월 무료 (연간 결제 혜택)</li>}
        </ul>
        <button
          onClick={handlePlanSelect}
          disabled={createLoading || isActive}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {isActive ? '이미 구독 중' : createLoading ? '처리 중...' : '구독하기'}
        </button>
      </div>

      {showConfirm && selectedPlan && (
        <div className="animate-fadeIn fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-3xl w-full relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute -top-0 -right-9 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-0.5 px-2 rounded-full transition shadow-lg z-10"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">Pro 무료 체험 시작</h3>
            <p className="text-gray-600 mb-6 text-center">30일 동안 모든 기능을 자유롭게 사용해보세요.</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <label className={`border ${selectedPlan === PLAN_TYPES.MONTHLY ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'} rounded-lg p-4 cursor-pointer`}>
                <input
                  type="radio"
                  name="modalPlan"
                  checked={selectedPlan === PLAN_TYPES.MONTHLY}
                  onChange={() => setSelectedPlan(PLAN_TYPES.MONTHLY)}
                  className="hidden"
                />
                <p className="text-sm font-semibold">월간 요금제</p>
                <p className="text-gray-500 text-sm">₩9,900</p>
              </label>
              <label className={`border ${selectedPlan === PLAN_TYPES.YEARLY ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'} rounded-lg p-4 cursor-pointer`}>
                <input
                  type="radio"
                  name="modalPlan"
                  checked={selectedPlan === PLAN_TYPES.YEARLY}
                  onChange={() => setSelectedPlan(PLAN_TYPES.YEARLY)}
                  className="hidden"
                />
                <p className="text-sm font-semibold">연간 요금제</p>
                <p className="text-gray-500 text-sm">₩99,000 (₩9,900/월)</p>
                <p className="text-green-600 text-xs mt-1">16% 할인</p>
              </label>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span>결제 기한</span>
                <span className="font-medium">{getPaymentDate()}</span>
              </div>
              <div className="flex justify-between">
                <span>오늘 결제 금액</span>
                <span className="font-semibold text-green-600">₩0 (30일 무료 체험)</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              {loading ? '처리 중...' : '다음'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
