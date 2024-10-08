"use client";

import { Box, Button, Chip, Skeleton, Typography } from "@mui/material";
import Attendance from "./Attendance";
import Payment from "../Payment/Payment";

import { useEffect, useState } from "react";
import AttendanceAuditComponent from "../Audit/AttendanceAudit";
import { motion } from "framer-motion";
import NavigateNextSharpIcon from "@mui/icons-material/NavigateNextSharp";
import PaymentAudit from "../Audit/PaymentAudit";
import AttendanceAuditGrid from "../Audit/AttendanceAuditGrid";
import { useClientSize } from "package/src/hooks/useMediaQuery";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddCardIcon from "@mui/icons-material/AddCard";
import useIsRendering from "package/src/hooks/useRenderStatus";

const ToggleBox = () => {
  const [toggle, setToggle] = useState<string>("attendance");
  const [page, setPage] = useState<string>("attendManagement");
  const [rendering, setRendering] = useState(false);
  const isRendering = useIsRendering();

  useEffect(() => {
    setRendering(true);
  }, []);

  const isMobile = useClientSize("sm");

  const handleToggle = (value: string) => {
    setToggle(value);
  };

  const handlePage = (value: string) => {
    setPage(value);
  };

  const ManagementMenu = () => {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            px: 3,
          }}
        >
          <Chip
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              width: 100,
              height: 30,
              cursor: "pointer",
              transition: "background-color 0.3s",
              mr: 1.5,
            }}
            onClick={() => {
              handlePage("attendManagement");
              handleToggle("attendance");
            }}
            label={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <AssignmentIcon
                  style={{ fontSize: 16 }}
                  sx={{ mr: 1 }}
                  color="success"
                />
                <Typography
                  variant="subtitle2"
                  color={
                    toggle === "attendance" ? "text.primary" : "text.disabled"
                  }
                >
                  출석관리
                </Typography>
              </Box>
            }
          ></Chip>

          <Chip
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              width: 100,
              height: 30,
              cursor: "pointer",
              "&:hover": {
                color: "text.primary",
              },
              transition: "background-color 0.3s",
            }}
            onClick={() => {
              handlePage("paymentManagement");
              handleToggle("payment");
            }}
            label={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <AddCardIcon
                  style={{ fontSize: 16 }}
                  sx={{ mr: 1 }}
                  color="info"
                />
                <Typography
                  variant="subtitle2"
                  color={
                    toggle === "payment" ? "text.primary" : "text.disabled"
                  }
                >
                  결제관리
                </Typography>
              </Box>
            }
          ></Chip>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row" }}>
          {toggle === "attendance" ? (
            <>
              <Box
                component={motion.div}
                transition={{ duration: 0.5, ease: "easeOut" }}
                exit={{ y: -20, opacity: 0 }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 120,
                  height: 40,
                  borderRadius: 2,
                  mb: 2,
                  cursor: "pointer",
                  "&:hover": {
                    color: "text.primary",
                  },
                  transition: "background-color 0.3s",
                }}
                onClick={() => handlePage("attendManagement")}
              >
                <NavigateNextSharpIcon
                  sx={{
                    mr: 1,
                    color:
                      page === "attendManagement"
                        ? "text.primary"
                        : "text.disabled",
                  }}
                />
                <Typography
                  variant="subtitle2"
                  color={
                    page === "attendManagement"
                      ? "text.primary"
                      : "text.disabled"
                  }
                >
                  출석관리
                </Typography>
              </Box>
              <Box
                component={motion.div}
                transition={{ duration: 0.5, ease: "easeOut" }}
                exit={{ y: -30, opacity: 0 }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 120,
                  height: 40,
                  mb: 2,
                  borderRadius: 2,
                  cursor: "pointer",
                  "&:hover": {
                    color: "text.primary",
                  },
                  transition: "background-color 0.3s",
                }}
                onClick={() => handlePage("attendAudit")}
              >
                <NavigateNextSharpIcon
                  sx={{
                    mr: 1,
                    color:
                      page === "attendAudit" ? "text.primary" : "text.disabled",
                  }}
                />

                <Typography
                  variant="subtitle2"
                  color={
                    page === "attendAudit" ? "text.primary" : "text.disabled"
                  }
                >
                  출석이력
                </Typography>
              </Box>
              <Box
                component={motion.div}
                transition={{ duration: 0.5, ease: "easeOut" }}
                exit={{ y: -30, opacity: 0 }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 136,
                  height: 40,
                  mb: 2,
                  borderRadius: 2,
                  cursor: "pointer",
                  "&:hover": {
                    color: "text.primary",
                  },
                  transition: "background-color 0.3s",
                }}
                onClick={() => handlePage("attendAuditGrid")}
              >
                <NavigateNextSharpIcon
                  sx={{
                    mr: 1,
                    color:
                      page === "attendAuditGrid"
                        ? "text.primary"
                        : "text.disabled",
                  }}
                />

                <Typography
                  variant="subtitle2"
                  color={
                    page === "attendAuditGrid"
                      ? "text.primary"
                      : "text.disabled"
                  }
                >
                  이력 그리드
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Box
                component={motion.div}
                transition={{ duration: 0.5, ease: "easeOut" }}
                exit={{ y: -20, opacity: 0 }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 120,
                  height: 40,
                  borderRadius: 2,
                  mb: 2,
                  cursor: "pointer",
                  "&:hover": {
                    color: "text.primary",
                  },
                  transition: "background-color 0.3s",
                }}
                onClick={() => handlePage("paymentManagement")}
              >
                <NavigateNextSharpIcon
                  sx={{
                    mr: 1,
                    color:
                      page === "paymentManagement"
                        ? "text.primary"
                        : "text.disabled",
                  }}
                />
                <Typography
                  variant="subtitle2"
                  color={
                    page === "paymentManagement"
                      ? "text.primary"
                      : "text.disabled"
                  }
                >
                  결제처리
                </Typography>
              </Box>

              <Box
                component={motion.div}
                transition={{ duration: 0.5, ease: "easeOut" }}
                exit={{ y: -20, opacity: 0 }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 120,
                  height: 40,
                  borderRadius: 2,
                  mb: 2,
                  cursor: "pointer",
                  "&:hover": {
                    color: "text.primary",
                  },
                  transition: "background-color 0.3s",
                }}
                onClick={() => handlePage("paymentAudit")}
              >
                <NavigateNextSharpIcon
                  sx={{
                    mr: 1,
                    color:
                      page === "paymentAudit"
                        ? "text.primary"
                        : "text.disabled",
                  }}
                />
                <Typography
                  variant="subtitle2"
                  color={
                    page === "paymentAudit" ? "text.primary" : "text.disabled"
                  }
                >
                  결제이력
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </>
    );
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          height: "80vh",
        }}
      >
        {rendering && (
          <>
            {isMobile ? (
              <>{ManagementMenu()}</>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "10%",
                  ml: 1,
                }}
              >
                <Box sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      p: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                        width: 150,
                        height: 40,
                        borderRadius: 2,
                        mb: 2,
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                      onClick={() => {
                        handlePage("attendManagement");
                        handleToggle("attendance");
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color={
                          toggle === "attendance"
                            ? "text.primary"
                            : "text.disabled"
                        }
                      >
                        출석관리
                      </Typography>
                    </Box>
                    {toggle === "attendance" ? (
                      <>
                        <Box
                          component={motion.div}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          exit={{ y: -20, opacity: 0 }}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 120,
                            height: 40,
                            borderRadius: 2,
                            mb: 2,
                            cursor: "pointer",
                            "&:hover": {
                              color: "text.primary",
                            },
                            transition: "background-color 0.3s",
                          }}
                          onClick={() => handlePage("attendManagement")}
                        >
                          <NavigateNextSharpIcon
                            sx={{
                              mr: 1,
                              color:
                                page === "attendManagement"
                                  ? "text.primary"
                                  : "text.disabled",
                            }}
                          />
                          <Typography
                            variant="subtitle2"
                            color={
                              page === "attendManagement"
                                ? "text.primary"
                                : "text.disabled"
                            }
                          >
                            출석관리
                          </Typography>
                        </Box>
                        <Box
                          component={motion.div}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          exit={{ y: -30, opacity: 0 }}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 120,
                            height: 40,
                            mb: 2,
                            borderRadius: 2,
                            cursor: "pointer",
                            "&:hover": {
                              color: "text.primary",
                            },
                            transition: "background-color 0.3s",
                          }}
                          onClick={() => handlePage("attendAudit")}
                        >
                          <NavigateNextSharpIcon
                            sx={{
                              mr: 1,
                              color:
                                page === "attendAudit"
                                  ? "text.primary"
                                  : "text.disabled",
                            }}
                          />

                          <Typography
                            variant="subtitle2"
                            color={
                              page === "attendAudit"
                                ? "text.primary"
                                : "text.disabled"
                            }
                          >
                            출석이력
                          </Typography>
                        </Box>
                        <Box
                          component={motion.div}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          exit={{ y: -30, opacity: 0 }}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 136,
                            height: 40,
                            mb: 2,
                            borderRadius: 2,
                            cursor: "pointer",
                            "&:hover": {
                              color: "text.primary",
                            },
                            transition: "background-color 0.3s",
                          }}
                          onClick={() => handlePage("attendAuditGrid")}
                        >
                          <NavigateNextSharpIcon
                            sx={{
                              mr: 1,
                              color:
                                page === "attendAuditGrid"
                                  ? "text.primary"
                                  : "text.disabled",
                            }}
                          />

                          <Typography
                            variant="subtitle2"
                            color={
                              page === "attendAuditGrid"
                                ? "text.primary"
                                : "text.disabled"
                            }
                          >
                            이력 그리드
                          </Typography>
                        </Box>
                      </>
                    ) : null}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                        width: 150,
                        height: 40,
                        borderRadius: 2,
                        my: 1,
                        cursor: "pointer",
                        "&:hover": {
                          color: "text.primary",
                        },
                        transition: "background-color 0.3s",
                      }}
                      onClick={() => {
                        handlePage("paymentManagement");
                        handleToggle("payment");
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color={
                          toggle === "payment"
                            ? "text.primary"
                            : "text.disabled"
                        }
                      >
                        결제관리
                      </Typography>
                    </Box>
                    {toggle === "payment" ? (
                      <>
                        <Box
                          component={motion.div}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          exit={{ y: -20, opacity: 0 }}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 120,
                            height: 40,
                            borderRadius: 2,
                            mb: 2,
                            cursor: "pointer",
                            "&:hover": {
                              color: "text.primary",
                            },
                            transition: "background-color 0.3s",
                          }}
                          onClick={() => handlePage("paymentManagement")}
                        >
                          <NavigateNextSharpIcon
                            sx={{
                              mr: 1,
                              color:
                                page === "paymentManagement"
                                  ? "text.primary"
                                  : "text.disabled",
                            }}
                          />
                          <Typography
                            variant="subtitle2"
                            color={
                              page === "paymentManagement"
                                ? "text.primary"
                                : "text.disabled"
                            }
                          >
                            결제처리
                          </Typography>
                        </Box>

                        <Box
                          component={motion.div}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          exit={{ y: -20, opacity: 0 }}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 120,
                            height: 40,
                            borderRadius: 2,
                            mb: 2,
                            cursor: "pointer",
                            "&:hover": {
                              color: "text.primary",
                            },
                            transition: "background-color 0.3s",
                          }}
                          onClick={() => handlePage("paymentAudit")}
                        >
                          <NavigateNextSharpIcon
                            sx={{
                              mr: 1,
                              color:
                                page === "paymentAudit"
                                  ? "text.primary"
                                  : "text.disabled",
                            }}
                          />
                          <Typography
                            variant="subtitle2"
                            color={
                              page === "paymentAudit"
                                ? "text.primary"
                                : "text.disabled"
                            }
                          >
                            결제이력
                          </Typography>
                        </Box>
                      </>
                    ) : null}
                  </Box>
                </Box>
              </Box>
            )}
          </>
        )}

        <Box
          sx={{
            width: isMobile ? "100%" : "90%",
            display: "flex",
            flexDirection: "column",
            overflowY: isMobile ? "hidden" : "none",
          }}
        >
          {page === "attendManagement" && <Attendance />}
          {page === "attendAudit" && <AttendanceAuditComponent />}
          {page === "attendAuditGrid" && <AttendanceAuditGrid />}
          {page === "paymentManagement" && <Payment />}
          {page === "paymentAudit" && <PaymentAudit />}
        </Box>
      </Box>
    </>
  );
};

export default ToggleBox;
