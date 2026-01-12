import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MesApi from "../api/MesApi"; // 이전에 정의한 API 모듈
import Common from "../utils/Common"; // 토큰 저장 로직이 담긴 유틸

// --- Styled Components (회원가입 페이지와 통일감 유지) ---
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const FormBox = styled.div`
  width: 400px;
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
  &:focus {
    outline: none;
    border-color: #1a73e8;
  }
`;

const LoginButton = styled.button`
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

const SignupLink = styled.p`
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
const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. MesApi를 통한 로그인 요청
      const response = await MesApi.login(email, password);

      // 2. 응답 데이터에서 토큰 추출 (TokenDto 구조: accessToken, refreshToken)
      const { accessToken, refreshToken } = response.data;

      // 3. Common 유틸을 사용하여 브라우저에 토큰 저장
      Common.setAccessToken(accessToken);
      Common.setRefreshToken(refreshToken);

      alert("로그인에 성공하였습니다.");

      // 4. 메인 대시보드로 이동 (App.js의 라우팅 설정에 따라 MesLayout이 적용됨)
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "이메일 또는 비밀번호가 일치하지 않습니다.";
      alert(errorMsg);
    }
  };

  return (
    <Container>
      <FormBox>
        <Title>MES SMART FACTORY</Title>
        <form onSubmit={handleLogin}>
          <InputGroup>
            <label>이메일</label>
            <Input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <label>비밀번호</label>
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>

          <LoginButton type="submit">로그인</LoginButton>
        </form>

        <SignupLink>
          처음이신가요?
          <span onClick={() => navigate("/signup")}>회원가입 하기</span>
        </SignupLink>
      </FormBox>
    </Container>
  );
};

export default LoginPage;
