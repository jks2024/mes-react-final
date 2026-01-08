import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MesApi from "../api/MesApi";

const PageContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;
const Title = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
`;
const FormGroup = styled.div`
  margin-bottom: 20px;
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #34495e;
  }
`;
const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
`;
const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
`;
const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.2s;
  &:hover {
    background-color: #2980b9;
  }
`;

const WorkOrderPage = () => {
  const navigate = useNavigate();
  const [productCode, setProductCode] = useState("EV-RELAY-001");
  const [targetQty, setTargetQty] = useState(10);

  const handleSubmit = async () => {
    if (targetQty <= 0) return alert("수량을 확인 하세요.");

    try {
      const response = await MesApi.createOrder(productCode, targetQty);
      if (response.data.status === "WAITING") {
        alert("주문 접수 성공! 현재 대기 중 입니다");
        navigate("/");
      }
    } catch (e) {
      alert("서버통신 오류!!!");
    }
  };

  return (
    <PageContainer>
      <Title>📝 생산 작업 지시</Title>
      <FormGroup>
        <label>생산 제품 선택 (Product)</label>
        <Select
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
        >
          <option value="EV-RELAY-001">EV-RELAY-001 (Standard)</option>
          <option value="EV-RELAY-PRO">EV-RELAY-PRO (High-End)</option>
          <option value="BATTERY-PACK">BATTERY-PACK (Module)</option>
        </Select>
      </FormGroup>
      <FormGroup>
        <label>목표 생산 수량 (Target Qty)</label>
        <Input
          type="number"
          value={targetQty}
          onChange={(e) => setTargetQty(e.target.value)}
          min="1"
        />
      </FormGroup>
      <SubmitButton onClick={handleSubmit}>생산 지시 전송 🚀</SubmitButton>
    </PageContainer>
  );
};

export default WorkOrderPage;
