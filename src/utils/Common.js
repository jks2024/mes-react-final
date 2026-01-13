import axios from "axios";

const Common = {
  KH_DOMAIN: "http://localhost:8111",

  getAccessToken: () => localStorage.getItem("accessToken"),
  setAccessToken: (token) => localStorage.setItem("accessToken", token),
  getRefreshToken: () => localStorage.getItem("refreshToken"),
  setRefreshToken: (token) => localStorage.setItem("refreshToken", token),

  // 401 에러 처리 (토큰 갱신) 함수
  handleUnauthorized: async () => {
    console.log("토큰 만료 감지: 재발급 시도...");
    const accessToken = Common.getAccessToken();
    const refreshToken = Common.getRefreshToken();

    // 백엔드 AuthService.refresh(TokenDto)는 accessToken과 refreshToken을 모두 필요로 함
    const tokenRequestDto = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    try {
      const res = await axios.post(
        `${Common.KH_DOMAIN}/auth/refresh`,
        tokenRequestDto // JSON 바디로 DTO 전달
      );

      console.log("토큰 재발급 성공:", res.data);
      // 백엔드에서 보낸 새로운 TokenDto 저장
      Common.setAccessToken(res.data.accessToken);
      Common.setRefreshToken(res.data.refreshToken);
      return true;
    } catch (err) {
      console.error("리프레시 토큰 만료 또는 인증 실패. 다시 로그인하세요.");
      localStorage.clear(); // 저장소 청소
      return false;
    }
  },
};

export default Common;
