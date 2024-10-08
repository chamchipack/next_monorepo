"use client";
import useIsRendering from "package/src/hooks/useRenderStatus";
import { useClientSize } from "package/src/hooks/useMediaQuery";
import { Box, Button, Skeleton } from "@mui/material";
import { useState } from "react";
import AttendanceAuditComponent from "../Audit/AttendanceAudit";
import AttendanceAuditGrid from "../Audit/AttendanceAuditGrid";
import PaymentAudit from "../Audit/PaymentAudit";
import Payment from "../Payment/Payment";
import Attendance from "./Attendance";
import ToggleBox from "./ToggleBox";

export default function Management() {
  const isRendering = useIsRendering();
  const isMobile = useClientSize("sm");
  const [toggle, setToggle] = useState<string>("attendance");
  const [page, setPage] = useState<string>("attendManagement");

  const handleToggle = (value: string) => setToggle(value);
  const handlePage = (value: string) => setPage(value);

  const buttons = [
    { label: "출석관리", page: "attendManagement", toggle: "attendance" },
    { label: "결제관리", page: "paymentManagement", toggle: "payment" },
  ];

  const attendanceSubButtons = [
    { label: "출석관리", page: "attendManagement" },
    { label: "출석 이력", page: "attendAudit" },
    { label: "이력 그리드", page: "attendAuditGrid" },
  ];

  const paymentSubButtons = [
    { label: "결제관리", page: "paymentManagement" },
    { label: "이력 그리드", page: "paymentAudit" },
  ];

  const renderSubButtons = () => {
    const subButtons =
      toggle === "attendance" ? attendanceSubButtons : paymentSubButtons;
    return subButtons.map((button) => (
      <Button
        key={button.page}
        sx={{ color: page === button.page ? "black" : "gray" }}
        onClick={() => handlePage(button.page)}
      >
        {button.label}
      </Button>
    ));
  };

  if (!isRendering)
    return (
      <>
        <Skeleton sx={{ width: "100%", height: 30 }} />
        <Skeleton sx={{ width: "100%", height: 30 }} />
        <Skeleton sx={{ width: "100%", height: 30 }} />
      </>
    );

  if (isMobile)
    return (
      <>
        <Box
          sx={{
            borderBottom: (theme) => `1px solid ${theme.palette.text.disabled}`,
            height: 30,
            display: "flex",
            flexDirection: "row",
          }}
        >
          {buttons.map((button) => (
            <Button
              key={button.page}
              sx={{
                color: toggle === button.toggle ? "black" : "gray",
                borderBottom:
                  toggle === button.toggle ? "2px solid black" : "none",
                borderRadius: 0,
              }}
              onClick={() => {
                handlePage(button.page);
                handleToggle(button.toggle);
              }}
            >
              {button.label}
            </Button>
          ))}
        </Box>
        <Box
          sx={{
            borderBottom: (theme) => `1px solid ${theme.palette.text.disabled}`,
            height: 30,
            mt: 2,
          }}
        >
          {renderSubButtons()}
        </Box>

        <Box sx={{ overflowY: "hidden" }}>
          {page === "attendManagement" && <Attendance />}
          {page === "attendAudit" && <AttendanceAuditComponent />}
          {page === "attendAuditGrid" && <AttendanceAuditGrid />}
          {page === "paymentManagement" && <Payment />}
          {page === "paymentAudit" && <PaymentAudit />}
        </Box>
      </>
    );

  return <ToggleBox />;
}
