import axios from "axios";
const HM_DOMAIN = "http://localhost:8111";

const MesApi = {
  // 주문 생성
  createOrder: (productCode, targetQty) => {
    return axios.post(`${HM_DOMAIN}/api/mes/order`, {
      productCode,
      targetQty: Number(targetQty),
    });
  },
  // 주문 목록 조회
  getOrders: () => {
    return axios.get(`${HM_DOMAIN}/api/mes/orders`);
  },
  // 자재 목록 조회
  getMaterials: () => {
    return axios.get(`${HM_DOMAIN}/api/mes/material/stock`);
  },
  // 자재 입고 처리 (POST)
  inboundMaterial: (formData) => {
    return axios.post(`${HM_DOMAIN}/api/mes/material/inbound`, formData);
  },
};

export default MesApi;
