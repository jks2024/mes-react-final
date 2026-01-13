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

// --- Styled Components ---
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr; // 좌측은 현황, 우측은 실시간 피드 (비율 조정)
  gap: 20px;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
`;

// 판정 결과에 따른 뱃지
const ResultBadge = styled.span`
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  color: white;
  background-color: ${(p) => (p.$result === "OK" ? "#2ecc71" : "#e74c3c")};
`;

// 상태에 따른 뱃지 (기존 유지)
const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.75rem;
  color: white;
  background-color: ${(p) =>
    p.$status === "IN_PROGRESS"
      ? "#2ecc71"
      : p.$status === "COMPLETED"
      ? "#3498db"
      : "#95a5a6"};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  margin-top: 5px;
  overflow: hidden;
  & > div {
    width: ${(p) => p.$percent}%;
    height: 100%;
    background: #3498db;
    transition: width 0.5s ease-in-out;
  }
`;

const DashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [logs, setLogs] = useState([]); // 실시간 생산 이력
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    let timerId;

    const fetchData = async () => {
      try {
        const [ordRes, matRes, logRes] = await Promise.all([
          MesApi.getOrders(),
          MesApi.getMaterials(),
          MesApi.getRecentLogs(), // 백엔드에서 구현한 최근 로그 API
        ]);

        setOrders(ordRes.data);
        setMaterials(matRes.data);
        setLogs(logRes.data);
        setLastUpdated(new Date());

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
    <div style={{ padding: "20px", background: "#f8f9fa", minHeight: "100vh" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>📊 실시간 5M1E 제조 실행 대시보드</h2>
        <small style={{ color: "#666", fontWeight: "bold" }}>
          최종 동기화: {lastUpdated.toLocaleTimeString()}
        </small>
      </header>

      <Grid>
        {/* --- 좌측 영역: 공정 및 재고 현황 --- */}
        <div>
          <Card>
            <h3>📋 작업 지시 진척도 (Method/Machine)</h3>
            {orders.map((order) => {
              const progress =
                Math.round((order.currentQty / order.targetQty) * 100) || 0;
              return (
                <div
                  key={order.id}
                  style={{
                    marginBottom: "20px",
                    borderBottom: "1px solid #f1f1f1",
                    paddingBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "1.1rem" }}>
                        {order.productCode}
                      </strong>
                      <StatusBadge
                        $status={order.status}
                        style={{ marginLeft: "10px" }}
                      >
                        {order.status}
                      </StatusBadge>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <strong>{order.currentQty}</strong> / {order.targetQty} EA
                    </div>
                  </div>
                  <ProgressBar $percent={progress}>
                    <div />
                  </ProgressBar>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#3498db",
                      marginTop: "4px",
                      textAlign: "right",
                    }}
                  >
                    달성률: {progress}%
                  </div>
                </div>
              );
            })}
          </Card>

          <Card>
            <h3>📉 실시간 자재 재고 (Material - Backflushing)</h3>
            <div style={{ width: "100%", height: "250px" }}>
              <ResponsiveContainer>
                <BarChart data={materials}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={11} tick={{ fill: "#666" }} />
                  <YAxis domain={[0, 200]} fontSize={11} />
                  <Tooltip />
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
        </div>

        {/* --- 우측 영역: 실시간 생산 로그 피드 (Traceability) --- */}
        <Card
          style={{
            maxHeight: "740px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3
            style={{ borderBottom: "2px solid #3498db", paddingBottom: "10px" }}
          >
            🕒 실시간 생산 이력 (Live Feed)
          </h3>
          <div style={{ overflowY: "auto", flex: 1, marginTop: "10px" }}>
            {logs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  background: log.result === "NG" ? "#fff5f5" : "transparent",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                  }}
                >
                  <ResultBadge $result={log.result}>{log.result}</ResultBadge>
                  <small style={{ color: "#999" }}>
                    {new Date(log.producedAt).toLocaleTimeString()}
                  </small>
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    color: "#333",
                  }}
                >
                  {log.serialNo}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#666",
                    marginTop: "4px",
                  }}
                >
                  👤 {log.operatorName || "미지정"} | ⚙️ {log.machineId}
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "#ccc",
                  marginTop: "50px",
                }}
              >
                데이터를 기다리는 중...
              </p>
            )}
          </div>
        </Card>
      </Grid>
    </div>
  );
};

export default DashboardPage;
