import { useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import moment from "moment";
import * as echarts from "echarts/core";
import db from "@/api/module";
import CardComponent from "./CardComponent";
import LineChartBase from "./LineChartBase";
import { Student } from "@/config/type/default/students";

interface Props {
  width?: string | number;
}
const EnrollmentChart = ({ width }: Props) => {
  const [loading, setLoading] = useState(false);
  const [enrollment, setEnrollment] = useState<{
    date: string[];
    data: any[];
  }>({ date: [], data: [] });
  const [standard, setStandard] = useState(7);

  const getEnrollmentRows = useCallback(async () => {
    setLoading(true);
    const { data: studentItems = [] } = await db.search("student", {
      options: {},
    });
    const studentRows: Student[] = studentItems;

    const dates = Array.from({ length: standard }, (_, i) =>
      moment()
        .subtract(standard - 1 - i, "month")
        .format("YY.MM")
    );
    const counts: number[] = Array(standard).fill(0);

    studentRows.forEach(({ enrollmentDate }) => {
      const enrollmentMonth = moment(enrollmentDate).format("YY.MM");

      const index = dates.indexOf(enrollmentMonth);
      if (index !== -1) {
        counts[index]++;
      }
    });

    const series: any[] = [
      {
        name: "신규 등록자 수",
        type: "line",
        data: counts,
        smooth: false,
        lineStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "#D8B5FF" }, // 시작 색상
            { offset: 1, color: "#1EAE98" }, // 끝 색상
          ]),
          width: 4,
        },
        itemStyle: {
          color: "#1EAE98",
          borderColor: "white",
          borderWidth: 2,
        },
      },
    ];

    setEnrollment({ date: dates, data: series });
    setLoading(false);
  }, []);

  useEffect(() => {
    getEnrollmentRows();
  }, [getEnrollmentRows]);

  return (
    <CardComponent
      loading={loading}
      title="월별 신규 등록현황"
      width={width || "100%"}
      height={300}
      firstColor="secondary.main"
      secondColor="primary.light"
      shadow={0}
      pgColor="gray"
      refresh
      refreshReturn={getEnrollmentRows}
    >
      <Box sx={{ pt: 2, px: 2, height: "100%" }}>
        <LineChartBase title="" dataset={enrollment} />
      </Box>
    </CardComponent>
  );
};

export default EnrollmentChart;
