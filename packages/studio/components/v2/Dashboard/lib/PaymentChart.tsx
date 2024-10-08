import { Box, Button } from "@mui/material";
import * as echarts from "echarts/core";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { CircleSharp } from "@mui/icons-material";
import CardComponent from "./CardComponent";
import LineChartBase from "./LineChartBase";
import db from "@/api/module";
import { Payment } from "@/config/type/default/payment";
import { useRecoilState } from "recoil";
import ToggleButtonStateAtom from "./state";

enum Toggle {
  entire = "entire",
  class = "class",
  type = "type",
  method = "method",
}

type FormatType = {
  [key: string]: { package: number; regular: number };
};
type FormatMethod = {
  [key: string]: { card: number; cash: number; account: number; other: number };
};

type PaymentType = "regular" | "package";
type MethodType = "card" | "cash" | "account" | "other";

const PaymentChart = () => {
  const [loading, setLoading] = useState(false);
  const [audit, setAudit] = useState<{
    date: string[];
    data: number[];
  }>({ date: [], data: [] });

  const [toggle, setToggle] = useRecoilState(ToggleButtonStateAtom);
  const [standard, setStandard] = useState(7);

  const onSearchEntire = (rows: Payment[], dates: string[]) => {
    const dateCountMap = dates.reduce(
      (acc, date) => {
        const formattedDate = moment(date, "YY.MM").format("YYYY-MM");
        acc[formattedDate] = 0;
        return acc;
      },
      {} as Record<string, number>
    );

    rows.forEach(({ amount = 0, paymentYearMonth = "" }) => {
      if (dateCountMap[paymentYearMonth] !== undefined) {
        dateCountMap[paymentYearMonth] += amount;
      }
    });

    const result = dates.map((date) => {
      const formattedDate = moment(date, "YY.MM").format("YYYY-MM");
      return dateCountMap[formattedDate] || 0;
    });

    const series: any[] = [
      {
        name: "월별 결제액",
        type: "line",
        data: result,
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

    return { date: dates, data: series };
  };
  const onSearchMethod = (rows: Payment[], dates: string[]) => {
    const dateCountMap: FormatMethod = dates.reduce(
      (acc: any, date) => {
        const formattedDate = moment(date, "YY.MM").format("YYYY-MM");
        acc[formattedDate] = { card: 0, account: 0, cash: 0, other: 0 };
        return acc;
      },
      {} as Record<string, number>
    );

    rows.forEach(({ method = "", amount = 0, paymentYearMonth = "" }) => {
      if (dateCountMap[paymentYearMonth] !== undefined) {
        dateCountMap[paymentYearMonth][method as MethodType] += amount;
      }
    });

    const _dates: string[] = [];
    const card: number[] = [];
    const cash: number[] = [];
    const account: number[] = [];
    const other: number[] = [];

    Object.entries(dateCountMap).forEach(([date, values]) => {
      _dates.push(date);
      card.push(values.card);
      cash.push(values.cash);
      account.push(values.account);
      other.push(values.other);
    });

    const series: any[] = [
      {
        name: "카드결제",
        type: "line",
        data: card,
        smooth: false,
        lineStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "#161684" }, // 시작 색상
            { offset: 1, color: "#C477E8" }, // 끝 색상
          ]),
          width: 4,
        },
        itemStyle: {
          color: "#C477E8",
          borderColor: "white",
          borderWidth: 2,
        },
      },
      {
        name: "현금결제",
        type: "line",
        data: cash,
        smooth: false,
        lineStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "#345E6A" }, // 시작 색상
            { offset: 1, color: "#2CA058" }, // 끝 색상
          ]),
          width: 4,
        },
        itemStyle: {
          color: "#345E6A",
          borderColor: "white",
          borderWidth: 2,
        },
      },
      {
        name: "계좌이체",
        type: "line",
        data: account,
        smooth: false,
        lineStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "#002CFA" }, // 시작 색상
            { offset: 1, color: "#06CE95" }, // 끝 색상
          ]),
          width: 4,
        },
        itemStyle: {
          color: "#002CFA",
          borderColor: "white",
          borderWidth: 2,
        },
      },
      {
        name: "기타",
        type: "line",
        data: other,
        smooth: false,
        lineStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "#E1204F" }, // 시작 색상
            { offset: 1, color: "#FFEC9E" }, // 끝 색상
          ]),
          width: 4,
        },
        itemStyle: {
          color: "#E1204F",
          borderColor: "white",
          borderWidth: 2,
        },
      },
    ];

    return { date: _dates, data: series };
  };

  const onSearchType = (rows: Payment[], dates: string[]) => {
    const dateCountMap: FormatType = dates.reduce(
      (acc: any, date) => {
        const formattedDate = moment(date, "YY.MM").format("YYYY-MM");
        acc[formattedDate] = { package: 0, regular: 0 };
        return acc;
      },
      {} as Record<string, number>
    );

    rows.forEach(({ paymentType = "", amount = 0, paymentYearMonth = "" }) => {
      if (dateCountMap[paymentYearMonth] !== undefined) {
        dateCountMap[paymentYearMonth][paymentType as PaymentType] += amount;
      }
    });
    const _dates: string[] = [];
    const packages: number[] = [];
    const regulars: number[] = [];

    Object.entries(dateCountMap).forEach(([date, values]) => {
      _dates.push(date);
      packages.push(values.package);
      regulars.push(values.regular);
    });

    const series: any[] = [
      {
        name: "회차결제",
        type: "line",
        data: packages,
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
      {
        name: "정기결제",
        type: "line",
        data: regulars,
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

    return { date: _dates, data: series };
  };

  const onLoadData = useCallback(async () => {
    setLoading(true);

    const dates = Array.from({ length: standard }, (_, i) =>
      moment()
        .subtract(standard - 1 - i, "month")
        .format("YY.MM")
    );

    try {
      const { data: rows } = await db.search("payment", {
        options: {
          "paymentYearMonth.gte": moment()
            .subtract(standard - 1, "month")
            .format("YYYY-MM"),
        },
      });
      let result: { date: string[]; data: number[] } = { date: [], data: [] };
      if (toggle === Toggle.entire) result = onSearchEntire(rows, dates);
      else if (toggle === Toggle.type) result = onSearchType(rows, dates);
      else if (toggle === Toggle.method) result = onSearchMethod(rows, dates);

      setAudit({ date: result.date, data: result.data });
    } catch {}
    setLoading(false);
  }, [toggle]);

  useEffect(() => {
    onLoadData();
  }, [onLoadData]);
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <LineChartBase title="" dataset={audit} labelString="원" />
      </Box>
    </>
  );
};

export default PaymentChart;
