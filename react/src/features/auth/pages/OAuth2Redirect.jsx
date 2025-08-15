import { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import { oauth2CompleteThunk } from '@features/auth/store/authThunk'


const OAuth2Redirect = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

    // 에러 응답 처리
    const handleError = (errorMessage) => {
        alert(`로그인 실패: ${errorMessage}`);
        navigate("/login");
    };

    // // 소셜 연동 흐름 처리
    // const handleLinkFlow = async () => {
    //     try {
    //         const res = await fetch("/api/users/pending-social-link", {
    //             credentials: "include",
    //         });

    //         if (!res.ok) throw new Error("연동 대상 정보 조회 실패");

    //         const { email, provider } = await res.json();
    //         if (!email || !provider) throw new Error("필수 정보 누락");

    //         const confirm = window.confirm(
    //             `이미 가입된 이메일입니다.\n${provider} 계정과 연동하시겠습니까?`
    //         );
    //         if (!confirm) {
    //             localStorage.removeItem("accessToken")
    //             document.cookie = "refreshToken=; Max-Age=0"
    //             navigate("/login");
    //             return;
    //         }

    //         const linkRes = await fetch("/api/users/link-social", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ email, provider }),
    //         });

    //         if (!linkRes.ok) throw new Error("연동 실패");

    //         alert("연동 완료! 다시 로그인해주세요.");
    //         navigate("/login");
    //     } catch (err) {
    //         alert("연동 중 오류: " + err.message);
    //         navigate("/login");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // 정상 로그인 처리
    const handleSuccessFlow = async () => {
        try {
            const result = await dispatch(oauth2CompleteThunk()).unwrap() // 빈 요청 → 토큰 헤더 받음
            console.log("OAuth2 로그인 완료:", result)
            navigate("/")
        } catch (err) {
            alert("소셜 로그인 처리 중 오류가 발생했습니다.");
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const error = params.get("error");
        const link = params.get("link") === "true";

        if (error) {
            handleError(error);
        } else if (link) {
            // handleLinkFlow();
        } else {
            handleSuccessFlow();
        }
    }, [location.search]);

    return (
        <div>
            <h2>{loading ? "로그인 처리중 입니다..." : "리디렉션 완료"}</h2>
        </div>
    )
}

export default OAuth2Redirect