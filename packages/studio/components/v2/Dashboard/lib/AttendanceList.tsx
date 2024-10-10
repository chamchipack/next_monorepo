import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { AttendStatus, AttendStatusTemplate, Rows } from ".";
import db from "@/api/module";
import { RegularPayment, Student } from "@/config/type/default/students";
import { CircleSharp } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import AlertModal from "../../Alert/Modal";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRecoilValue } from "recoil";
import EditAccessAtom from "@/config/type/access/state";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const AttendanceList = () => {
  const { data: session, status } = useSession();
  const editAccessState = useRecoilValue(EditAccessAtom);

  const [rows, setRows] = useState<Rows[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setSelectedId("");
    setExcusedTime("");
    setOpen(false);
  };

  const convertRowStatus = (status: AttendStatus, way: string) => {
    if (!status || !way) return "";

    const type = AttendStatusTemplate[status];

    return way === "name" ? type.name : type.color;
  };

  const [attMethod, setAttMethod] = useState("present");
  const handleChange = (event: any) => {
    setAttMethod(event.target.value);
  };

  const [excusedTime, setExcusedTime] = useState("");

  const handleTimeChange = (event: any) => {
    setExcusedTime(event.target.value);
  };

  const onClickSaveAttendinfo = async () => {
    const row: Rows | undefined = rows.find(({ id = "" }) => id === selectedId);

    if (!row?.id) return;

    if (!attMethod) return toast.error("출석 종류를 선택해주세요.");
    if (attMethod === "excused" && !excusedTime)
      return toast.error("보강시간을 선택해주세요.");
    const today = moment().format("YYYY-MM-DD");

    const form = {
      sessionId: row.sessionId[0] || "",
      sessionName: "",
      classId: row.classId[0] || "",
      className: "",
      studentId: row.id,
      studentName: row.name || "",
      paymentType: row.paymentType || "",
      instructorId: row.instructorId[0] || "",
      confirmationId: session?.user?.id || "",
      dayOfWeek: moment().format("d"),
      attendanceDate: moment(`${today} ${row?.lessonTime?.stime}`).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      status: attMethod,
      confirmationDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      excusedDate: excusedTime,
    };

    try {
      await db.create("attendance", form);
      await delay(200);

      if (row.paymentType === "package") {
        const {
          total,
          remaining = 0,
          over = 0,
          isPaid,
        } = row?.lessonBasedPayment;
        const studentForm = {
          id: row.id,
          lessonBasedPayment: {
            total,
            remaining: remaining > 0 ? remaining - 1 : 0,
            over: !isPaid && !remaining ? over + 1 : over,
            isPaid: remaining > 1 ? true : false,
          },
        };

        await db.update("student", studentForm);
      }

      onLoadData();
      toast.success("정상적으로 처리 되었습니다.");
    } catch {
      toast.error("오류가 발생했습니다.");
    }

    setLoading(false);
    setOpen(false);
  };

  const isPaymentValid = (regularPayment: RegularPayment): boolean => {
    const { lastPaymentDate, nextDueDate } = regularPayment;
    if (!lastPaymentDate || !nextDueDate) return false;

    const todayDate = moment().format("YYYY-MM-DD");
    const lastPayment = moment(lastPaymentDate).format("YYYY-MM-DD");
    const nextDue = moment(nextDueDate).format("YYYY-MM-DD");

    return todayDate >= lastPayment && todayDate <= nextDue;
  };

  const onLoadData = useCallback(async () => {
    setLoading(true);
    const day = moment().format("d");
    const { data: sessionItems = [] } = await db.search("session", {
      options: {
        "regularDays.like": day,
      },
    });

    if (!sessionItems.length) {
      setLoading(false);
      return setRows([]);
    }

    const todaySession = sessionItems.map(({ id = "" }) => id);

    const sessionIdWidthTime = sessionItems.reduce(
      (acc: { [key: string]: { stime: string; etime: string } }, item: any) => {
        acc = { ...acc, [item?.id]: item.lessonTimes[day] ?? {} };
        return acc;
      },
      {}
    );

    await delay(300);

    const { data: studentItems } = await db.search("student", {
      options: { "sessionId.or": todaySession, "currentStatus.equal": true },
    });
    // const studentItems = items.filter(
    //   ({ currentStatus = false }) => currentStatus
    // );

    const { data: attendance } = await db.search("attendance", {
      options: {
        "attendanceDate.like": moment().format("YYYY-MM-DD"),
      },
    });

    const todayLog = attendance.reduce(
      (acc: object, { studentId = "", status = "", excusedDate = "" }) => {
        Object.assign(acc, { [studentId]: { status, excusedDate } });
        return acc;
      },
      {}
    );

    const result: Rows[] = studentItems.reduce((acc: Rows[], data: Student) => {
      const {
        id = "",
        paymentType = "",
        regularPayment = {},
        lessonBasedPayment,
        sessionId = [],
      } = data;
      let rowStatus: AttendStatus = "standby";

      if (todayLog[id]) rowStatus = todayLog[id].status;
      else {
        switch (paymentType) {
          case "regular":
            if (!isPaymentValid(regularPayment)) rowStatus = "needCharge";
            break;
          case "package":
            if (!lessonBasedPayment.isPaid) rowStatus = "needCharge";
            break;
        }
      }

      acc.push({
        ...data,
        rowStatus,
        excusedDate: todayLog[id]?.excusedDate ?? "",
        isEditable: true,
        lessonTime:
          data?.type === "lesson"
            ? sessionIdWidthTime[sessionId[0] || ""]
            : {} || {},
        // isEditable: rowStatus === "standby" ? true : false,
      });
      return acc;
    }, []);
    setRows(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    onLoadData();
  }, []);
  return (
    <>
      {loading ? (
        <>
          {[...Array(3)].map((_, index) => (
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "50%",
                }}
              >
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width="30%"
                  height={20}
                  sx={{ mb: 0.5, mr: 0.5 }}
                />
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width="70%"
                  height={20}
                  sx={{ mb: 0.5 }}
                />
              </Box>
              <Box>
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width="70%"
                  height={20}
                  sx={{ mb: 0.5 }}
                />
              </Box>
            </Box>
          ))}
        </>
      ) : (
        <Box sx={{ overflowY: "auto", height: "85%" }}>
          {!rows.length ? (
            <Alert severity="warning" variant="outlined" sx={{ my: 1 }}>
              <Typography variant="body1">출석 대상자가 없습니다.</Typography>
            </Alert>
          ) : (
            rows.map(({ id, name, ...rest }) => (
              <>
                <Box
                  key={id}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1,
                    height: 60,
                    borderBottom: (theme) =>
                      `1px solid ${alpha(theme.palette.text.secondary, 0.1)}`,
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: (theme) => theme.palette.grey[800] }}
                    >
                      {name}{" "}
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.disabled"
                      >
                        {rest?.paymentType === "package"
                          ? "회차결제"
                          : "정기결제"}
                      </Typography>
                    </Typography>

                    <Typography variant="caption">
                      {rest?.lessonTime?.stime} ~ {rest?.lessonTime?.etime}
                    </Typography>
                  </Box>
                  <Box>
                    <Box
                      style={{
                        display: "flex",
                        flexShrink: 0,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      sx={{ px: 0.5 }}
                    >
                      <Button
                        fullWidth
                        size="medium"
                        variant="outlined"
                        disabled={
                          rest?.rowStatus !== "standby" || !editAccessState
                        }
                        sx={{
                          color: convertRowStatus(rest?.rowStatus, "color"),
                          pl: 1,
                          pr: 1,
                          borderRadius: 4,
                          border: (theme) =>
                            `1px solid ${theme.palette.grey["A100"]}`,
                        }}
                        onClick={() => {
                          setSelectedId(id as string);
                          setOpen(true);
                        }}
                      >
                        <CircleSharp
                          style={{ fontSize: 6 }}
                          sx={{
                            color:
                              rest?.rowStatus !== "standby"
                                ? "text.disabled"
                                : convertRowStatus(rest?.rowStatus, "color"),
                            mr: 1,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              rest?.rowStatus !== "standby"
                                ? "text.disabled"
                                : convertRowStatus(rest?.rowStatus, "color"),
                          }}
                        >
                          {convertRowStatus(rest?.rowStatus, "name")}
                        </Typography>
                      </Button>
                    </Box>
                  </Box>
                </Box>
                {/* <Divider sx={{ mt: 1.5 }} /> */}
              </>
            ))
          )}
          <AlertModal
            open={open}
            handleClose={handleClose}
            onClickCheck={onClickSaveAttendinfo}
            title="출석 처리"
            content="선택한 인원을 출석처리 하시겠습니까?"
            processing={loading}
          >
            <Box sx={{ minWidth: 80, my: 2 }}>
              <FormControl
                fullWidth
                size="small"
                variant="outlined"
                sx={{ minWidth: 80 }}
              >
                <InputLabel id="payment-select-label" sx={{ fontSize: 14 }}>
                  출석종류
                </InputLabel>
                <Select
                  labelId="payment-select-label"
                  id="payment-select"
                  value={attMethod}
                  onChange={handleChange}
                  label="출석 방법"
                  sx={{ fontSize: 14, height: 30 }}
                >
                  <MenuItem value="present">정상출석</MenuItem>
                  <MenuItem value="late">지각</MenuItem>
                  <MenuItem value="excused">보강</MenuItem>
                  <MenuItem value="absent">결석</MenuItem>
                </Select>
              </FormControl>
              {attMethod === "excused" ? (
                <Box sx={{ mt: 1.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "start",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 1, mr: 1 }}
                    >
                      보강날짜
                    </Typography>
                    <TextField
                      id="schedule-end"
                      type="date"
                      //   disabled={Boolean(item.excusedDate)}
                      value={excusedTime}
                      onChange={handleTimeChange}
                      sx={{
                        borderColor: "#d2d2d2",
                        borderRadius: 1,
                        height: 20,
                        fontSize: 12,
                      }}
                      InputProps={{
                        style: {
                          color: "text.secondary",
                          height: 20,
                          fontSize: 12,
                        },
                      }}
                    />
                  </Box>
                </Box>
              ) : null}
            </Box>
          </AlertModal>
        </Box>
      )}
    </>
  );
};

export default AttendanceList;
