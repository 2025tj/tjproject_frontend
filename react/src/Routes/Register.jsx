import React, { useState } from 'react'

const Register = () => {
 const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    phone: "",
    user: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("회원가입 데이터:", formData);
    // 여기서 axios.post("/api/signup", formData) 가능
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">회원가입</h2>
        
      <input name="email" type="email" placeholder="이메일" onChange={handleChange} required /> <br />
      <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required /><br />
      <input name="nickname" type="text" placeholder="닉네임" onChange={handleChange} required /> <br />
      <input name="phone" type="text" placeholder="전화번호" onChange={handleChange} required /> <br />
      <input name="user" type="text" placeholder="유저명" onChange={handleChange} required />
      <button type="submit">회원가입 제출</button>
    </form>
    
    </>
  );
};

export default Register
