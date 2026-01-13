import AxiosInstance from "./AxiosInstance";
import Common from "../utils/Common";
import axios from "axios";

const publicApi = axios.create({
  baseURL: Common.KH_DOMAIN,
});

const MesApi = {
  // --- 인증 관련 ---
  login: (email, password) => {
    return publicApi.post(`/auth/login`, {
      email,
      password,
    });
  },
  signup: (memberData) => {
    return publicApi.post(`/auth/signup`, memberData);
  },

  // 주문 생성
  createOrder: (productCode, targetQty) => {
    return AxiosInstance.post(`/api/mes/order`, {
      productCode,
      targetQty: Number(targetQty),
    });
  },
  // 주문 목록 조회
  getOrders: () => {
    return AxiosInstance.get(`/api/mes/orders`);
  },
  // 자재 목록 조회
  getMaterials: () => {
    return AxiosInstance.get(`/api/mes/material/stock`);
  },
  // 자재 입고 처리 (POST)
  inboundMaterial: (formData) => {
    return AxiosInstance.post(`/api/mes/material/inbound`, formData);
  },

  getRecentLogs: () => AxiosInstance.get(`/api/mes/production/recent-logs`),
};

export default MesApi;
