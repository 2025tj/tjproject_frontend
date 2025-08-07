import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { clearWarning } from '@features/auth/store/authSlice';

const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1500,
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '1.5rem 2rem',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  maxWidth: '400px',
  width: '90%',
  textAlign: 'center',
  fontSize: '1rem',
  color: '#333',
  position: 'relative',
};

const closeBtnStyle = {
  position: 'absolute',
  top: '8px',
  right: '12px',
  fontSize: '1.2rem',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};

const GlobalModalAlert = () => {
  const warning = useSelector(state => state.auth.warning)
  const dispatch = useDispatch()

  // 1.5초 후 자동 닫기
  useEffect(() => {
    if (!warning) return;
    const timer = setTimeout(() => {
      dispatch(clearWarning());
    }, 1500);
    return () => clearTimeout(timer);
  }, [warning, dispatch]);

  if (!warning) return null;

  return (
    <div style={overlayStyle} onClick={() => dispatch(clearWarning())}>
      <div
        style={modalStyle}
        onClick={e => e.stopPropagation()} // 모달 밖 클릭시 닫히지만, 모달 안 클릭은 닫히지 않게
        role="alertdialog"
        aria-live="assertive"
        aria-modal="true"
      >
        <button
          aria-label="Close alert"
          onClick={() => dispatch(clearWarning())}
          style={closeBtnStyle}
        >
          &times;
        </button>
        <p>⚠️ {warning}</p>
      </div>
    </div>
  )
}

export default GlobalModalAlert
