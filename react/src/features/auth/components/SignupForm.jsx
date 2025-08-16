import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupThunk } from "../store/authThunk";
import { useNavigate } from "react-router-dom";
import "../css/SignupForm.css";
import LoginFormModal from "./LoginFormModal";

const SignupForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleLoginClick = (e) => {
    e.preventDefault();
    setIsLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // 초기화
    try {
      await dispatch(signupThunk(form)).unwrap();
      alert("회원 가입 성공! 로그인 후 이용해주세요.");
      navigate("/login");
    } catch (err) {
      console.log(err);
      if (typeof err === "object") {
        setErrors(err); // { email: '...', password: '...' } 형태
      } else {
        alert(err);
      }

      // setErrors('회원가입에 실패했습니다.')

      // if (err.response?.status === 400) {
      //     setErrors(err.response.data) // 유효성 검사 실패
      // } else if (err.response?.status === 409) {
      //     setErrors({email: '이미 사용중인 이메일 입니다.'})
      // } else {
      //     alert('예상치 못한 오류가 발생했습니다.')
      // }
    }
  };
  return (
    <>
      <div className="signup-root">
        <div className="signup-form-container">
            <div className="title-block">
                <h1 className="heading">계정 만들기</h1>
            </div>
            <fieldset className="signup-fieldset">
                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-section">
                        <div className="form-field">
                            <label className="field-label">이메일 주소</label>
                            <input
                            id="email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="이메일 주소"
                            autoComplete="email"
                            />
                            {errors.email && (
                                <p className="error-message">{errors.email}</p>
                            )}
                        </div>
                        <div className="form-field">
                            <label className="field-label">비밀번호</label>
                            <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="비밀번호"
                            autoComplete="new-password"
                            />
                            {errors.password && (
                                <span className="error-message">{errors.password}</span>
                            )}
                        </div>
                        <div className="form-field">
                            <label className="field-label">비밀번호 확인</label>
                            <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="비밀번호 확인"
                            autoComplete="new-password"
                            />
                            {errors.confirmPassword && (
                            <span className="error-message">
                                {errors.confirmPassword}
                            </span>
                            )}
                            {errors.passwordConfirmed && (
                            <span className="error-message">
                                {errors.passwordConfirmed}
                            </span>
                            )}
                        </div>
                        <div className="form-field">
                            <label className="field-label">닉네임</label>
                            <input
                            id="nickname"
                            type="text"
                            name="nickname"
                            value={form.nickname}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="닉네임"
                            autoComplete="nickname"
                            />
                            {errors.nickname && (
                            <span className="error-message">{errors.nickname}</span>
                            )}
                        </div>
                    </div>
                    <div className="form-actions ctas">
                        <div className="submit-wrapper">
                            <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                            >
                            {loading ? "가입 중..." : "계속"}
                            </button>

                            <div className="login-link">
                                이미 계정이 있으신가요? <a href="#" onClick={handleLoginClick}>로그인</a>
                            </div>
                        </div>
                    </div>
                </form>
            </fieldset>
            <div className="footer">
                <span className="footer-text">
                    <a href="/terms">이용약관</a>
                    <span className="separator"></span>
                    <a href="/privacy">개인정보 보호 정책</a>
                </span>
            </div>
        </div>

        {/* <form onSubmit={handleSubmit} style={{ maxWidth: 400 }} className='bg-white p-8 rounded shadow-md w-full max-w-md'>
            <div>
                <label>이메일</label><br />
                <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                />
                {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
            </div>

            <div>
                <label>비밀번호</label><br />
                <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                />
                {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
            </div>

            <div>
                <label>비밀번호 확인</label><br />
                <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                />
                {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
                {errors.passwordConfirmed && (
                <p style={{ color: 'red' }}>{errors.passwordConfirmed}</p>
                )}
            </div>

            <div>
                <label>닉네임</label><br />
                <input
                type="text"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                />
                {errors.nickname && <p style={{ color: 'red' }}>{errors.nickname}</p>}
            </div>

            <button type="submit" style={{ marginTop: '1rem' }} disabled={loading}>
                {loading ? '가입 중...' : '회원가입'}
            </button>
        </form> */}
      </div>

      <LoginFormModal
        open={isLoginModalOpen} 
        onclose={handleLoginModalClose}
      />
    </>
  );
};

export default SignupForm;
