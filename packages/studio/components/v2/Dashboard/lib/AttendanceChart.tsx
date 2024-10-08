import { useEffect, useState, useCallback } from "react";
import { Box, TextField } from "@mui/material";
import moment from "moment";
import * as echarts from "echarts/core";
import db from "@/api/module";
import CardComponent from "./CardComponent";
import LineChartBase from "./LineChartBase";
import { Session } from "@/config/type/default/session";
import NumberInputField from "./NumberInputField";

type Day = {
  [key: string]: { count: number };
};

interface Props {
  width?: string | number;
}

const AttendanceChart = ({ width }: Props) => {
  const [loading2, setLoading2] = useState(false);
  const [standard, setStandard] = useState(7);

  const [attendanceValue, setAttendanceValue] = useState<{
    date: string[];
    data: any[];
  }>({ date: [], data: [] });

  const getAttendanceRows = useCallback(async () => {
    setLoading2(true);

    const day: Day = {
      "0": { count: 0 },
      "1": { count: 0 },
      "2": { count: 0 },
      "3": { count: 0 },
      "4": { count: 0 },
      "5": { count: 0 },
      "6": { count: 0 },
    };

    const onCount: Day = {
      "0": { count: 0 },
      "1": { count: 0 },
      "2": { count: 0 },
      "3": { count: 0 },
      "4": { count: 0 },
      "5": { count: 0 },
      "6": { count: 0 },
    };

    const dates = Array.from({ length: standard }, (_, i) =>
      moment()
        .subtract(standard - 1 - i, "days")
        .format("YYYY-MM-DD")
    );
    const { data: studentItems = [] } = await db.search("student", {
      options: { "currentStatus.like": true },
    });
    const studentIds = studentItems.map(({ id = "" }) => id);

    const { data: sessionItems = [] } = await db.search("session", {
      options: {},
    });

    const sessions = sessionItems.filter(({ studentId = [] }) =>
      studentIds.includes(...(studentId as string[]))
    );

    const totalCount: Day = sessions.reduce((acc: Day, item: Session) => {
      item.regularDays.forEach((v) => (acc[v]["count"] += 1));
      return acc;
    }, day);

    const { data: attendance } = await db.search("attendance", {
      options: {
        "attendanceDate.gte": moment()
          .subtract(standard - 1, "days")
          .format("YYYY-MM-DD"),
        "attendanceDate.lte": moment().add(1, "days").format("YYYY-MM-DD"),
      },
    });

    attendance.forEach(({ attendanceDate = "" }) => {
      const date = moment(attendanceDate);

      if (date.isValid()) {
        const d = date.format("d"); // 유효한 날짜일 경우에만 d를 생성
        onCount[d]["count"] += 1;
      }
    });

    const result = dates.reduce(
      (acc, value) => {
        const date = moment(value).format("d");
        acc["total"].push(totalCount[date]["count"]);
        acc["target"].push(onCount[date]["count"]);
        return acc;
      },
      { total: [] as number[], target: [] as number[] }
    );

    const series: any[] = [
      {
        name: "전체 출석대상자 수",
        type: "line",
        data: result.total,
        smooth: false,
        lineStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "#BFF098" }, // 시작 색상
            { offset: 1, color: "#6FD6FF" }, // 끝 색상
          ]),
          width: 4,
        },
        itemStyle: {
          color: "#C6EA8D",
          borderColor: "white",
          borderWidth: 2,
        },
      },
      {
        name: "출석처리 수",
        type: "line",
        data: result.target,
        smooth: false,
        lineStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "#EA8D8D" }, // 시작 색상
            { offset: 1, color: "#A890FE" }, // 끝 색상
          ]),
          width: 4,
        },
        itemStyle: {
          color: "#EA8D8D",
          borderColor: "white",
          borderWidth: 2,
        },
      },
    ];

    setAttendanceValue({ date: dates, data: series });
    setLoading2(false);
  }, []);

  useEffect(() => {
    getAttendanceRows();
  }, [getAttendanceRows]);

  return (
    <CardComponent
      loading={loading2}
      title={`최근 ${standard}일간 출석처리수 비교`}
      width={width || "100%"}
      height={300}
      firstColor="warning.light"
      secondColor="error.light"
      shadow={0}
      pgColor="gray"
      refresh
      refreshReturn={getAttendanceRows}
    >
      <Box sx={{ pt: 1, px: 2, height: "100%", width: "100%" }}>
        <LineChartBase title="" dataset={attendanceValue} />
      </Box>
    </CardComponent>
  );
};

export default AttendanceChart;
