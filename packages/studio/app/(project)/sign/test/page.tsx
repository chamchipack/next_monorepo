"use client";

import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import db from "@/api/module";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// QueryClient 인스턴스 생성
const queryClient = new QueryClient();

// 데이터를 불러오는 함수
const fetchStudents = async ({ queryKey }: { queryKey: any }) => {
  const [{ pagination }] = queryKey;

  const { data: { items = [], totalItems = 0 } = {} } = await db.search(
    "student",
    { pagination, options: {} }
  );

  return { rows: items, total: totalItems };
};

// 테스트 컴포넌트, useState를 내부에서 사용하도록 수정
const TestComponent = () => {
  const [add, setAdd] = useState(1);
  return (
    <Box>
      {add}
      <Button onClick={() => setAdd(add + 1)}>Increment</Button>
    </Box>
  );
};

const Component = () => {
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });

  const {
    data = { rows: [], total: 0 },
    isLoading,
    error,
  } = useQuery({
    queryKey: [{ pagination }],
    queryFn: fetchStudents,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <>
      {data.rows.map((item) => (
        <Box key={item.id}>{item.name}</Box>
      ))}
      {/* 직접 컴포넌트를 호출하여 렌더링 */}
      <TestComponent />
    </>
  );
};

// QueryClientProvider로 컴포넌트를 감싸서 QueryClient를 제공
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Component />
    </QueryClientProvider>
  );
}
