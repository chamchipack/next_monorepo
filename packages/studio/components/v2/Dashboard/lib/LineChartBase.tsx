import dynamic from "next/dynamic";
import { FC, useEffect, useRef } from "react";
import * as echarts from "echarts";
import moment from "moment";
import { Typography } from "@mui/material";

interface Props {
  dataset?: { date: string[]; data: any[] };
  title: string;
  labelString?: string;
}

const LineChartBase: FC<Props> = ({
  title,
  dataset = { date: [], data: [] },
  labelString = "건",
}) => {
  const chartRef = useRef(null);

  const option = {
    title: {
      text: title || "",
      textStyle: {
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 12,
        lineHeight: 30,
      },
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: dataset.date,
      axisLine: {
        show: false, // X축 라인 숨기기
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      // max: 100, // 100%를 최고로 설정
      axisLabel: {
        formatter: `{value}${labelString}`, // Y축 레이블에 '%' 추가
      },
      splitLine: {
        show: false, // Y축 가로 라인 숨기기
      },
    },
    series: dataset.data,
  };

  useEffect(() => {
    const chart = chartRef.current ? echarts.init(chartRef.current) : null;
    if (chart) {
      chart.setOption(option);

      const handleResize = () => {
        chart.resize();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.dispose();
      };
    }
  }, [option]);

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
};

export default LineChartBase;
