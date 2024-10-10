import {
  Box,
  Typography,
  Grid,
  useTheme,
  alpha,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ButtonBase,
  Alert,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import LightTooltip from "@/components/common/Tooltip/LightTooltip";

import db from "@/api/module";
import {
  Attendance,
  AttendanceDataModel,
} from "@/config/type/default/attendance";
import { Student } from "@/config/type/default/students";
import AlertModal from "../Alert/Modal";
import json2xlsx from "@/config/utils/xlsx";

interface RowData {
  id: string;
  name: string;
  records: { day: string; status: string; excusedDate: string }[];
}

type Status = "present" | "absent" | "excused" | "late";

enum ConvertStatus {
  present = "정상출석",
  absent = "결석",
  excused = "보강",
  late = "지각",
}

const DaysOfWeek: { [k: string]: string } = {
  "0": "일요일",
  "1": "월요일",
  "2": "화요일",
  "3": "수요일",
  "4": "목요일",
  "5": "금요일",
  "6": "토요일",
};

const getDaysInMonth = (month: number, year: number) => {
  return Array.from(
    { length: moment(`${year}-${month}`, "YYYY-MM").daysInMonth() },
    (_, i) =>
      moment(`${year}-${month}-${i + 1}`, "YYYY-MM-DD").format("YYYY-MM-DD")
  );
};

const AttendanceAuditComponent = () => {
  const theme = useTheme();

  const [processing, setProcessing] = useState(false);
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [displayedData, setDisplayedData] = useState<RowData[]>([]);
  const [visibleRows, setVisibleRows] = useState(10);
  const [rangeMethod, setRangeMethod] = useState("year");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const [onOff, setOnOff] = useState(false);
  const handleClose = () => setOpen(false);

  const getStatusColor = (status: string) => {
    const statusColorMap: Record<string, string> = {
      present: theme.palette.success.main,
      absent: theme.palette.error.main,
      late: theme.palette.warning.main,
      excused: theme.palette.secondary.main,
    };
    return statusColorMap[status] || "white";
  };

  const onLoadData = useCallback(
    async (date: string) => {
      const params = onOff ? { "currentStatus.like": true } : {};
      const studentItems = await db
        .search("student", { options: params })
        .then((res) => res.data || []);
      const attItems = await db
        .search("attendance", {
          options: { "attendanceDate.like": selectedDate || date },
        })
        .then((res) => res.data || []);

      const result = studentItems.reduce((acc: RowData[], row: Student) => {
        const atts = attItems.filter(
          ({ studentId = "" }) => row?.id === studentId
        );
        if (selectedDate && !atts.length) return acc;

        acc.push({
          id: row?.id as string,
          name: row?.name,
          records: atts.map(
            ({ attendanceDate = "", status = "", excusedDate = "" }) => ({
              day: moment(attendanceDate).format("YYYY-MM-DD"),
              status,
              excusedDate,
            })
          ),
        });

        return acc;
      }, []);

      setDisplayedData(result);
    },
    [currentMonth, visibleRows, onOff, selectedDate]
  );

  const exportExcel = async () => {
    // rangeMethod 수정 필요 => 작년 월 선택 등
    const params = {};

    rangeMethod === "year"
      ? params
      : Object.assign(params, {
          "attendanceDate.like": moment(currentMonth).format("YYYY-MM"),
        });

    const { data: attItems } = await db.search("attendance", {
      options: { ...params },
    });

    if (!attItems.length) return;
    const exception = ["id", "classId", "sessionId", "studentId"];

    const result = attItems.map((item: any, index: number) => {
      const form: any = { 순번: index + 1 };

      Object.entries(item).forEach(([k, v]: [string, any]) => {
        if (AttendanceDataModel[k] && !exception.includes(k)) {
          switch (k) {
            case "status":
              form[AttendanceDataModel[k]] = ConvertStatus[v as Status];
              break;
            case "paymentType":
              form[AttendanceDataModel[k]] =
                v === "regular" ? "정기결제" : "회차결제";
              break;
            case "dayOfWeek":
              form[AttendanceDataModel[k]] = DaysOfWeek[v as string] || "";
              break;
            default:
              form[AttendanceDataModel[k]] = v;
          }
        }
      });
      return form;
    });

    json2xlsx(result, "출석이력");

    handleClose();
  };

  useEffect(() => {
    const month = currentMonth.month() + 1;
    const year = currentMonth.year();
    const daysInCurrentMonth = getDaysInMonth(month, year);
    const date = moment(`${year}-${month}`).format("YYYY-MM");

    onLoadData(date);
    setDays(daysInCurrentMonth);
  }, [currentMonth, visibleRows, onOff, selectedDate]);

  const handlePrevMonth = () =>
    setCurrentMonth(currentMonth.clone().subtract(1, "months"));
  const handleNextMonth = () =>
    setCurrentMonth(currentMonth.clone().add(1, "months"));

  const renderDayButton = (day: string, index: number) => {
    const isSelected = selectedDate === day;
    return (
      <Box
        sx={{
          minWidth: "45px",
          maxWidth: "45px",
          display: "flex",
          justifyContent: "center",
          height: "100%",
          // borderTop: `2px solid ${theme.palette.grey[100]}`,
          borderBottom: `2px solid ${theme.palette.grey[100]}`,
        }}
      >
        <ButtonBase
          key={index}
          onClick={() => setSelectedDate(isSelected ? "" : day)}
        >
          <Grid
            item
            sx={{
              background: (theme) =>
                selectedDate
                  ? isSelected
                    ? theme.palette.primary.main
                    : // : theme.palette.grey[100]
                      ""
                  : theme.palette.background.default,
              minWidth: "50px",
              borderRadius: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            {selectedDate ? (
              <Typography
                color={isSelected ? "text.contrast" : "text.disabled"}
              >
                {moment(day).format("D")}
              </Typography>
            ) : (
              <Typography
                color={
                  ["0", "6"].includes(moment(day).format("d"))
                    ? "error.main"
                    : "text.primary"
                }
              >
                {moment(day).format("D")}
              </Typography>
            )}
          </Grid>
        </ButtonBase>
      </Box>
    );
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: 2,
          p: 2,
          pl: 2,
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            width: "100%",
            position: "sticky",
            background: theme.palette.background.default,
            zIndex: 99,
            top: 0,
          }}
        >
          <IconButton onClick={handlePrevMonth}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h4" sx={{ mx: 2 }}>
            {currentMonth.format("YYYY년 MM월")}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "120px",
                mt: 1,
                mb: 2,
                height: "20px",
              }}
            >
              <Button
                fullWidth
                size="medium"
                variant="outlined"
                sx={{
                  color: "text.secondary",
                  background: onOff
                    ? theme.palette.primary.main
                    : theme.palette.grey[100],
                  borderRadius: 3,
                  pr: 1,
                  pl: 1,
                  border: onOff
                    ? theme.palette.primary.main
                    : theme.palette.grey[100],
                }}
                onClick={() => {
                  setOnOff(!onOff);
                  setVisibleRows(10);
                }}
              >
                재원만 보기
              </Button>
            </Box>
          </Box>
          <Box>
            <Button
              variant="outlined"
              size="medium"
              sx={{
                pl: 1,
                pr: 1,
                mr: 0.5,
                mb: 1,
                borderRadius: 1,
                border: `1.5px solid ${theme.palette.grey[100]}`,
                borderColor: "success.main",
                color: "success.main",
              }}
              onClick={() => setOpen(true)}
            >
              <DocumentScannerIcon
                style={{ fontSize: 16 }}
                sx={{
                  mr: 1,
                  background: theme.palette.success.main,
                  color: "background.default",
                  borderRadius: 50,
                }}
              />
              엑셀출력
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            height: "90%",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            overflowX: "auto",
            p: 1,
          }}
        >
          {/* 컬럼 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              minHeight: 60,
              width: "100%",
              position: "sticky",
              background: theme.palette.background.default,
              zIndex: 99,
              top: -10,
            }}
          >
            <Box
              sx={{
                minWidth: "80px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                // borderTop: `2px solid ${theme.palette.grey[100]}`,
                borderBottom: `2px solid ${theme.palette.grey[100]}`,
              }}
            >
              <Typography>이름</Typography>
            </Box>

            {days.map(renderDayButton)}
          </Box>
          {/* 로우 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              background: (theme) =>
                selectedId
                  ? alpha(theme.palette.grey[300], 0.9)
                  : theme.palette.background.default,
            }}
          >
            {displayedData.length ? (
              <>
                {displayedData.map((record, recordIndex) => (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      mt: 1,
                      cursor: "pointer",
                      background: (theme) =>
                        !selectedId
                          ? theme.palette.background.default
                          : selectedId !== record?.id
                            ? alpha(theme.palette.grey[300], 0.9)
                            : theme.palette.background.default,
                    }}
                    onClick={() => {
                      if (record?.id === selectedId) setSelectedId("");
                      else setSelectedId(record?.id);
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: "80px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "40px",
                      }}
                    >
                      <Typography variant="caption" color="text.disabled">
                        {recordIndex + 1}{" "}
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {record.name.length > 4
                            ? `${record?.name.slice(0, 4)}...`
                            : record?.name}
                        </Typography>
                      </Typography>
                    </Box>
                    {days.map((day, index) => {
                      const recordForDay = record.records.find(
                        (r) => r.day === day
                      );
                      return (
                        <Box
                          sx={{
                            minWidth: "45px",
                            display: "flex",
                            justifyContent: "center",
                            height: "40px",
                            alignItems: "center",
                            borderLeft: `0.5px solid ${alpha(
                              theme.palette.grey[100],
                              0.6
                            )}`,
                            borderTop: `0.5px solid ${alpha(
                              theme.palette.grey[100],
                              0.6
                            )}`,
                            borderBottom: `0.5px solid ${alpha(
                              theme.palette.grey[100],
                              0.6
                            )}`,
                            p: 0.5,
                            background: (theme) =>
                              !selectedId
                                ? theme.palette.background.default
                                : selectedId !== record?.id
                                  ? alpha(theme.palette.grey[300], 0.9)
                                  : theme.palette.background.default,
                          }}
                        >
                          {recordForDay?.day ? (
                            <LightTooltip
                              title={
                                <Box>
                                  <Box
                                    sx={{
                                      p: 1,
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      sx={{ mr: 1 }}
                                    >
                                      {record.name}
                                    </Typography>

                                    <Typography
                                      variant="subtitle2"
                                      color="text.secondary"
                                      sx={{ mr: 1 }}
                                    >
                                      {moment(recordForDay?.day).format("M")}월{" "}
                                      {moment(recordForDay?.day).format("D")}일
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color={getStatusColor(
                                        recordForDay?.status as string
                                      )}
                                    >
                                      {
                                        ConvertStatus[
                                          recordForDay?.status as Status
                                        ]
                                      }
                                    </Typography>
                                  </Box>
                                  {(recordForDay?.status as Status) ===
                                    "excused" &&
                                  (recordForDay?.excusedDate as string) ? (
                                    <Box sx={{ p: 1 }}>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        보강일
                                        <Typography
                                          variant="caption"
                                          component="span"
                                          color="text.disabled"
                                          sx={{ mx: 1 }}
                                        >
                                          {moment(
                                            recordForDay?.excusedDate
                                          ).format("M월 D일")}
                                        </Typography>
                                      </Typography>
                                    </Box>
                                  ) : null}
                                </Box>
                              }
                            >
                              <Box
                                sx={{
                                  borderRadius: 1,
                                  width: "100%",
                                  height: "100%",
                                  backgroundColor: recordForDay
                                    ? getStatusColor(recordForDay.status)
                                    : "white",
                                }}
                              />
                            </LightTooltip>
                          ) : null}
                        </Box>
                      );
                    })}
                  </Box>
                ))}
              </>
            ) : (
              <Alert severity="warning" variant="outlined" sx={{ my: 1 }}>
                <Typography variant="body1">검색된 이력이 없습니다.</Typography>
              </Alert>
            )}
          </Box>
        </Box>
      </Box>
      <AlertModal
        open={open}
        handleClose={handleClose}
        onClickCheck={exportExcel}
        title={`출석이력 엑셀 다운로드`}
        content={`출석이력이 있는 수강생만 출력됩니다.`}
        processing={processing}
      >
        <Box sx={{ minWidth: 80, my: 2 }}>
          <FormControl
            fullWidth
            size="small"
            variant="outlined"
            sx={{ minWidth: 80 }}
          >
            <InputLabel id="payment-select-label" sx={{ fontSize: 14 }}>
              기간 설정
            </InputLabel>
            <Select
              labelId="payment-select-label"
              id="payment-select"
              value={rangeMethod}
              onChange={(e) => setRangeMethod(e.target.value)}
              label="결제 방법"
              sx={{ fontSize: 14, height: 30 }}
            >
              <MenuItem value="year">이번해</MenuItem>
              <MenuItem value="month">선택된 달</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </AlertModal>
    </>
  );
};

export default AttendanceAuditComponent;
