import React, { useState, useEffect } from "react";
import MesApi from "../api/MesApi";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Styled Components (기존과 동일)
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const Badge = styled.span`
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  color: white;
  background-color: ${(p) =>
    p.$status === "IN_PROGRESS"
      ? "#2ecc71"
      : p.$status === "COMPLETED"
      ? "#3498db"
      : "#95a5a6"};
`;

const DashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    let timerId;

    const fetchData = async () => {
      try {
        const [ordRes, matRes] = await Promise.all([
          MesApi.getOrders(),
          MesApi.getMaterials(),
        ]);

        setOrders(ordRes.data);
        setMaterials(matRes.data);
        setLastUpdated(new Date());

        // ★ 순차적 폴링: 응답을 받은 후 2초 뒤에 다음 실행 예약
        timerId = setTimeout(fetchData, 2000);
      } catch (e) {
        console.error("데이터 로드 실패:", e);
        timerId = setTimeout(fetchData, 5000);
      }
    };

    fetchData();

    return () => clearTimeout(timerId);
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h2>📊 실시간 생산 대시보드</h2>
        {/* 업데이트 시간을 표시하여 시스템 동작 확인 */}
        <small style={{ color: "#888" }}>
          Last Sync: {lastUpdated.toLocaleTimeString()}
        </small>
      </div>

      <Grid>
        <Card>
          <h3>📋 작업 지시 현황 (Live)</h3>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                borderBottom: "1px solid #eee",
                padding: "10px 0",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <strong>{order.productCode}</strong>{" "}
                <Badge $status={order.status}>{order.status}</Badge>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>
                  Order ID: {order.id}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  {order.currentQty}
                </span>{" "}
                / {order.targetQty}
                <div style={{ fontSize: "0.8rem", color: "blue" }}>
                  진척률:{" "}
                  {Math.round((order.currentQty / order.targetQty) * 100)}%
                </div>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <h3>📉 BOM 자재 재고 (Backflushing 확인)</h3>
          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer>
              <BarChart data={materials}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={11} interval={0} />

                {/* ★ 수정 1: Y축 범위를 0~200으로 고정하여 착시 현상 방지 */}
                <YAxis domain={[0, 200]} />

                <Tooltip />
                {/* ★ 수정 2: isAnimationActive={false} 추가 
                    데이터가 바뀔 때 애니메이션 없이 즉각적으로 막대 길이를 반영합니다. */}
                <Bar
                  dataKey="currentStock"
                  fill="#8884d8"
                  name="현재 재고"
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Grid>
    </>
  );
};

export default DashboardPage;
