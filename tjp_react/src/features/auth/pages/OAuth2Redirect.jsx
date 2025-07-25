import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@features/auth/hooks/useAuth'

const OAuth2Redirect = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { completeOAuth2, login } = useAuth()

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const searchParams = new URLSearchParams(location.search)
        const errorParam = searchParams.get('error')
        
        if (errorParam) {
          setError(errorParam)
          setTimeout(() => navigate('/login'), 3000)
          return
        }

        // 백엔드의 /auth/oauth2/complete 엔드포인트 호출
        const result = await completeOAuth2().unwrap()
        
        // 성공하면 홈으로 이동
        navigate('/')
      } catch (err) {
        console.error('OAuth2 처리 실패:', err)
        setError(err || 'OAuth2 처리 중 오류가 발생했습니다.')
        
        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } finally {
        setLoading(false)
      }
    }

    handleRedirect()
  }, [location.search, navigate, completeOAuth2])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        height: '50vh'
      }}>
        <h2>OAuth2 로그인 처리 중...</h2>
        <p>잠시만 기다려주세요.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        height: '50vh'
      }}>
        <h2>로그인 실패</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <p>3초 후 로그인 페이지로 이동합니다...</p>
      </div>
    )
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '50vh'
    }}>
      <h2>처리 완료</h2>
    </div>
  )
}

export default OAuth2Redirect

//     // 에러 응답 처리
//     const handleError = (errorMessage) => {
//         alert(`로그인 실패: ${errorMessage}`);
//         navigate("/login");
//     };

//     // 소셜 연동 흐름 처리
//     const handleLinkFlow = async () => {
//         try {
//             const res = await fetch("/api/users/pending-social-link", {
//                 credentials: "include",
//             });

//             if (!res.ok) throw new Error("연동 대상 정보 조회 실패");

//             const { email, provider } = await res.json();
//             if (!email || !provider) throw new Error("필수 정보 누락");

//             const confirm = window.confirm(
//                 `이미 가입된 이메일입니다.\n${provider} 계정과 연동하시겠습니까?`
//             );
//             if (!confirm) {
//                 localStorage.removeItem("accessToken")
//                 document.cookie = "refreshToken=; Max-Age=0"
//                 navigate("/login");
//                 return;
//             }

//             const linkRes = await fetch("/api/users/link-social", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email, provider }),
//             });

//             if (!linkRes.ok) throw new Error("연동 실패");

//             alert("연동 완료! 다시 로그인해주세요.");
//             navigate("/login");
//         } catch (err) {
//             alert("연동 중 오류: " + err.message);
//             navigate("/login");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // 정상 로그인 처리
//     const handleSuccessFlow = async () => {
//         try {
//             const res = await api.get("/auth/oauth2/complete"); // 빈 요청 → 토큰 헤더 받음
//             saveAccessFromHeaders(res.headers);
//             const user = await checkLogin();
//             dispatch(login(user));
//             navigate("/");
//         } catch (err) {
//             alert("소셜 로그인 처리 중 오류가 발생했습니다.");
//             navigate("/login");
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     useEffect(() => {
//         const params = new URLSearchParams(location.search);
//         const error = params.get("error");
//         const link = params.get("link") === "true";

//         if (error) {
//             handleError(error);
//         } else if (link) {
//             handleLinkFlow();
//         } else {
//             handleSuccessFlow();
//         }
//     }, [location.search]);

//     return (
//         <div>
//             <h2>{loading ? "로그인 처리중 입니다..." : "리디렉션 완료"}</h2>
//         </div>
//     )
// }

// export default OAuth2Redirect