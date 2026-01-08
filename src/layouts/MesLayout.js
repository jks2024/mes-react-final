import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import GlobalStyle from "../style/GlobalStyle";

const Navbar = styled.nav`
  background: #2c3e50;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Logo = styled.h1`
  color: white;
  font-size: 1.2rem;
  margin: 0;
  span {
    color: #3498db;
  }
`;
const Menu = styled.div`
  display: flex;
  gap: 20px;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${(p) => (p.$active ? "#3498db" : "#ecf0f1")};
  font-weight: ${(p) => (p.$active ? "bold" : "normal")};
`;
const Content = styled.div`
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
`;

const MesLayout = () => {
  const loc = useLocation();

  return (
    <>
      <GlobalStyle />
      <Navbar>
        <Logo>
          🏭 MES <span>System</span>
        </Logo>
        <Menu>
          <StyledLink to="/" $active={loc.pathname === "/"}>
            대시보드
          </StyledLink>
          <StyledLink to="/order" $active={loc.pathname === "/order"}>
            작업지시
          </StyledLink>
          <StyledLink to="/material" $active={loc.pathname === "/material"}>
            자재관리
          </StyledLink>
        </Menu>
      </Navbar>

      <Content>
        <Outlet /> {/* ✅ 여기 자리에 페이지가 바뀌어 끼워짐 */}
      </Content>
    </>
  );
};

export default MesLayout;
