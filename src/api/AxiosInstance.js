import axios from "axios";
import Common from "../utils/Common";

const AxiosInstance = axios.create({
  // axios 인스턴스 생성
  baseURL: Common.KH_DOMAIN,
});

AxiosInstance.interceptors.request.use(
  // 요청 인터셉터 추가
  async (config) => {
    const accessToken = Common.getAccessToken();
    console.log("전송되는 토큰:", accessToken); // 여기서 토큰이 출력되는지 확인
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error); // 에러 발생시
  }
);

// 응답 인터셉터
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 발생 시 && 재시도한 적이 없을 때만 실행
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 플래그 설정 (무한 루프 방지)

      try {
        const isRefreshed = await Common.handleUnauthorized();

        if (isRefreshed) {
          const newToken = Common.getAccessToken();
          console.log("새 토큰으로 재시도 시작:", newToken);

          // ★ 중요: 원래 요청의 헤더를 새 토큰으로 교체
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // AxiosInstance 대신 원본 axios에 설정값을 넣어 재요청 (인터셉터 중복 방지)
          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error("재발급 프로세스 중 에러:", refreshError);
      }

      // 재발급 실패 시 로그아웃 처리 및 이동
      // localStorage.clear();
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
