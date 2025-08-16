// src/pages/EmailVerify.jsx
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { emailService } from '@features/email/services/emailService'
import { useDispatch } from 'react-redux'
import { fetchUserProfileThunk } from '@features/user/store/userThunk'

export default function EmailVerify() {
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState('인증 처리 중...');
  const token = searchParams.get('token');
  const dispatch = useDispatch()
  const hasRun = useRef(false)

  // 1. 토큰으로 백엔드에 인증 요청
  useEffect(() => {
    console.log('EmailVerify Component mounted')
    console.log('token : ', token)
    if (hasRun.current) return
    hasRun.current = true;
    if (!token) {
      console.log('token is null' )
      setResult('토큰 정보가 없습니다.');
      return;
    }
  //   api.get(`/email/verify?token=${token}`)
  //     .then(res => setResult(res.data))
  //     .catch(err => {
  //       setResult(
  //         err.response?.data
  //           ? err.response.data
  //           : '알 수 없는 오류로 인증에 실패했습니다.'
  //       );
  //     });
  // }, [token]);

    console.log('emailService.verifyToken(token) : url= ', window.location.href)
    emailService
      .verifyToken(token)
      .then((message) => {
        console.log('emailService.verifyToken(token) : message= ', message)
        setResult(message)
        if (message === '이메일 인증이 완료되었습니다.') {
          console.log('fetchUserProfileThunk()')
        // 인증 성공 시 사용자 정보 최신화
          dispatch(fetchUserProfileThunk())
            .then((result) => {
              console.log('fetchUserProfileThunk() : result= ', result)
            })
            .catch((err) => {
              console.log('fetchUserProfileThunk() : err= ', err)
            })
        } else {
          console.error('fetchUserProfileThunk() failed ', message)
        }
      })
      .catch((err) => {
        console.error('emailService.verifyToken(token) : failed ', err)
        console.error('err.message : ', {
          message: err.message,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data
        })
        setResult(
          err.message || '알 수 없는 오류로 인증에 실패했습니다.'
        );
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      })
  }, [token, dispatch])

  // 2. 인증 성공 메시지에 따라 자동 리디렉트
  useEffect(() => {
    if (result === '이메일 인증이 완료되었습니다.') {
      // 2초 후 로그인 페이지로 이동
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
  }, [result]);

  return (
    <div style={{ margin: '2rem', textAlign: 'center' }}>
      <h2>이메일 인증 결과</h2>
      <p>{result}</p>
      {result === '이메일 인증이 완료되었습니다.' && (
        <p style={{ color: 'gray', fontSize: '0.9rem' }}>
          2초 후 로그인 화면으로 이동합니다...
        </p>
      )}
    </div>
  );
}