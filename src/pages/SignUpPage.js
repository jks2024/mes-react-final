import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MesApi from "../api/MesApi"; // 기존에 정의한 API 모듈

// --- Styled Components ---
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const FormBox = styled.div`
  width: 450px;
  padding: 50px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 35px;
  color: #1a73e8;
  font-size: 28px;
  letter-spacing: -1px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 600;
    color: #555;
  }
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #1a73e8;
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  background-color: white;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1557b0;
  }
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: 25px;
  font-size: 14px;
  color: #666;

  span {
    color: #1a73e8;
    cursor: pointer;
    font-weight: 600;
    margin-left: 5px;
    &:hover {
      text-decoration: underline;
    }
  }
`;

// --- Component ---
const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    authority: "ROLE_OPERATOR", // 기본값: 작업자
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await MesApi.signup(formData);
      if (response.status === 200 || response.status === 201) {
        alert(`${response.data.name}님, 회원가입이 완료되었습니다!`);
        navigate("/"); // 가입 성공 후 로그인 페이지로 이동
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "회원가입에 실패했습니다.";
      alert(errorMsg);
    }
  };

  return (
    <Container>
      <FormBox>
        <Title>MES 계정 생성</Title>
        <form onSubmit={handleSignup}>
          <InputGroup>
            <label>이메일 (계정)</label>
            <Input
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <label>비밀번호</label>
            <Input
              name="password"
              type="password"
              placeholder="8자 이상 입력"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <label>이름 (성함)</label>
            <Input
              name="name"
              placeholder="실명을 입력하세요"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <label>사용자 권한</label>
            <Select
              name="authority"
              value={formData.authority}
              onChange={handleChange}
            >
              <option value="ROLE_OPERATOR">현장 작업자 (Operator)</option>
              <option value="ROLE_ADMIN">시스템 관리자 (Admin)</option>
            </Select>
          </InputGroup>

          <SubmitButton type="submit">회원 가입하기</SubmitButton>
        </form>

        <LoginLink>
          이미 계정이 있으신가요?
          <span onClick={() => navigate("/login")}>로그인하러 가기</span>
        </LoginLink>
      </FormBox>
    </Container>
  );
};

export default SignupPage;
