import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputLabel,
  Skeleton,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { AttendStatus, AttendStatusTemplate, Rows, AttendEnums } from ".";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AttendanceDataAtom from "./state";
import { useRecoilState } from "recoil";
import moment from "moment";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import db from "@/api/module";
import { useSession } from "next-auth/react";
import AlertModal from "../../Alert/Modal";

interface Props {
  rows: Rows[];
  loading: boolean;
  load: () => void;
}

type ClickEvent = {
  [id: string]: AttendStatus;
};

type ClickTimeEvent = {
  [id: string]: string;
};

const AttendanceCheck = ({ rows, loading, load }: Props) => {
  const { data: session, status } = useSession();
  const theme = useTheme();

  const [target, setTarget] = useState<Rows[]>(rows);
  const [event, setEvent] = useState<ClickEvent>({}); // 초기값을 빈 객체로 설정
  const [eventTime, setEventTime] = useState<ClickTimeEvent>({});
  const [selectedRow, setSelectedRow] = useState<Rows>();
  const [isClicked, setIsClicked] = useState(false);
  const [isChargeClicked, setIsChargeClicked] = useState(false);

  const [processing, setProcessing] = useState(false);
  const [open, setOpen] = useState(false);

  const [dateState, setDateState] = useRecoilState(AttendanceDataAtom);

  const getColor = (color: string) => {
    const [palette, shade] = color.split(".") as [
      keyof typeof theme.palette,
      string,
    ];
    const ptColor = theme.palette[palette];

    if (ptColor && typeof ptColor === "object" && shade in ptColor)
      return ptColor[shade as keyof typeof ptColor];

    return undefined;
  };

  useEffect(() => {
    const excused = rows.reduce((acc, item) => {
      if (item.excusedDate) acc = { [item.id as string]: item.excusedDate };
      return acc;
    }, {});

    if (Object.entries(excused).length) setEventTime(excused);
    setTarget(rows);
  }, [rows]);

  const handleButtonClick = (id: string | undefined, status: AttendStatus) => {
    if (!id) return;

    setEvent((prev) => {
      if (prev[id] && prev[id] === status) {
        const { [id]: _, ...rest } = prev; // id를 제거한 새로운 객체를 만듦
        return rest;
      } else {
        return {
          ...prev,
          [id]: status,
        };
      }
    });
  };

  const handleClose = () => setOpen(false);

  const onClickSaveAttendinfo = async () => {
    if (!Object.entries(event).length)
      return toast.error("출석 대상자의 내용을 선택해주세요");

    setProcessing(true);

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const attendTarget = target.filter(({ isEditable = false }) => isEditable);

    try {
      for (let i = 0; i < attendTarget.length; i++) {
        const { id = "", ...rest } = attendTarget[i];
        let status = "";
        let excusedTime = "";

        if (event[id]) status = event[id];

        if (eventTime[id]) excusedTime = eventTime[id];

        const form = {
          sessionId: rest.sessionId[0] || "",
          sessionName: "",
          classId: rest.classId[0] || "",
          className: "",
          studentId: id,
          studentName: rest.name || "",
          paymentType: rest.paymentType || "",
          instructorId: rest.instructorId[0] || "",
          confirmationId: session?.user?.id || "",
          dayOfWeek: moment(dateState.attendanceDate).format("d"),
          attendanceDate: moment(dateState.attendanceDate).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          status,
          confirmationDate: moment().format("YYYY-MM-DD HH:mm:ss"),
          excusedDate: excusedTime,
        };

        if (status) {
          await db.create("attendance", form);

          if (rest.paymentType === "package") {
            const {
              total,
              remaining = 0,
              over,
              isPaid,
            } = rest?.lessonBasedPayment;
            const studentForm = {
              id,
              lessonBasedPayment: {
                total,
                remaining: remaining > 0 ? remaining - 1 : 0,
                over,
                isPaid: remaining > 1 ? true : false,
              },
            };
          }

          await delay(500);
        }
      }
    } catch {
      return toast.error("오류가 발생했습니다.");
    }

    load();
    setProcessing(false);
    setOpen(false);
    toast.success("정상적으로 처리 되었습니다.");
  };

  return (
    <>
      <Box
        sx={{
          mx: 1,
          border: (theme) => `1px solid ${theme.palette.grey[100]}`,
          borderRadius: 2,
          height: "100%",
        }}
      >
        <Box
          sx={{
            p: 3,
            // border: (theme) => `1px solid ${theme.palette.grey[100]}`,
            // borderRadius: 2,
            // overflowY: "scroll",
            // height: "600px",
            // minWidth: "600px",
          }}
        >
          {loading ? (
            <>
              {[...Array(3)].map((_, index) => (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    width="100%"
                    height={20}
                    sx={{ mb: 0.5, mr: 0.5 }}
                  />
                </Box>
              ))}
            </>
          ) : (
            <>
              {!target.length ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" color="info.main">
                      {moment(dateState?.attendanceDate).format("MM월 DD일")}{" "}
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        출석 대상자
                      </Typography>
                    </Typography>

                    <Box
                      style={{
                        display: "flex",
                        flexShrink: 0,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      sx={{ width: "120px", mt: 2, mb: 2, height: "30px" }}
                    >
                      <Button
                        fullWidth
                        size="medium"
                        variant="outlined"
                        sx={{
                          color: "text.secondary",
                          background: (theme) =>
                            isClicked
                              ? getColor("primary.main")
                              : theme.palette.grey[100],
                          borderRadius: 3,
                          pr: 1,
                          pl: 1,
                          border: (theme) =>
                            isClicked
                              ? getColor("primary.main")
                              : theme.palette.grey[100],
                        }}
                        onClick={() => {
                          if (isClicked) setTarget(rows);
                          else
                            setTarget(
                              target.filter(
                                ({ isEditable = false }) => isEditable
                              )
                            );
                          setIsClicked(!isClicked);
                        }}
                      >
                        <CheckCircleOutlineIcon
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: 50,
                            color: "background.default",
                            background: (theme) => theme.palette.warning.main,
                            mr: 1,
                          }}
                        />
                        미출석만 표시
                      </Button>
                    </Box>
                  </Box>
                  <Alert severity="warning" variant="outlined" sx={{ my: 1 }}>
                    <Typography variant="body1">대상자가 없습니다.</Typography>
                  </Alert>
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1" color="info.main">
                      {moment(dateState?.attendanceDate).format("MM월 DD일")}{" "}
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        출석 대상자
                      </Typography>
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        style={{
                          display: "flex",
                          flexShrink: 0,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        sx={{ width: "120px", mt: 2, mb: 2, height: "30px" }}
                      >
                        <Button
                          fullWidth
                          size="medium"
                          variant="outlined"
                          sx={{
                            color: "text.secondary",
                            background: (theme) =>
                              isClicked
                                ? getColor("primary.main")
                                : theme.palette.grey[100],
                            borderRadius: 3,
                            pr: 1,
                            pl: 1,
                            border: (theme) =>
                              isClicked
                                ? getColor("primary.main")
                                : theme.palette.grey[100],
                          }}
                          onClick={() => {
                            if (isClicked) setTarget(rows);
                            else
                              setTarget(
                                target.filter(
                                  ({ isEditable = false }) => isEditable
                                )
                              );
                            setIsClicked(!isClicked);
                          }}
                        >
                          <CheckCircleOutlineIcon
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: 50,
                              color: "background.default",
                              background: (theme) => theme.palette.warning.main,
                              mr: 1,
                            }}
                          />
                          미출석만 표시
                        </Button>
                      </Box>

                      <Box
                        style={{
                          display: "flex",
                          flexShrink: 0,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        sx={{
                          width: "90px",
                          ml: 2,
                          mt: 2,
                          mb: 2,
                          height: "30px",
                        }}
                      >
                        <Button
                          fullWidth
                          size="medium"
                          variant="outlined"
                          sx={{
                            "&:hover": {
                              background: (theme) =>
                                isChargeClicked
                                  ? getColor("warning.main")
                                  : theme.palette.grey[100],
                            },
                            color: "text.secondary",
                            background: (theme) =>
                              isChargeClicked
                                ? getColor("warning.main")
                                : theme.palette.grey[100],
                            borderRadius: 3,
                            pr: 1,
                            pl: 1,
                            border: (theme) =>
                              isChargeClicked
                                ? getColor("warning.main")
                                : theme.palette.grey[100],
                          }}
                          onClick={() => {
                            if (isChargeClicked) setTarget(rows);
                            else
                              setTarget(
                                target.filter(
                                  ({ rowStatus }) => "needCharge" === rowStatus
                                )
                              );
                            setIsChargeClicked(!isChargeClicked);
                          }}
                        >
                          <CreditCardIcon
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: 50,
                              color: "background.default",
                              background: (theme) => theme.palette.warning.main,
                              mr: 1,
                            }}
                          />
                          결제필요
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ overflowY: "auto", maxHeight: "500px", mt: 2 }}>
                    {target.map((item, index) => (
                      <Box
                        key={item.id}
                        sx={{
                          maxHeight: "50px",
                          mb: 4,
                          p: 2,
                          // background: (theme) => alpha(theme.palette.info.light, 0.3),
                          borderTop: (theme) =>
                            `2px solid ${theme.palette.grey[100]}`,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row ",
                            }}
                          >
                            <Box sx={{ width: "40px" }}>
                              <Typography
                                variant="subtitle2"
                                color="text.primary"
                              >
                                {index + 1}.
                              </Typography>
                            </Box>

                            <Box sx={{ width: "60px" }}>
                              <Typography
                                variant="subtitle2"
                                color="text.primary"
                              >
                                {item.type === "lesson" ? "레슨" : "수업"}
                              </Typography>
                            </Box>

                            <Box sx={{ width: "80px" }}>
                              <Typography
                                variant="subtitle2"
                                color="text.primary"
                              >
                                {item.paymentType === "regular"
                                  ? "정기결제"
                                  : "회차결제"}
                              </Typography>
                            </Box>

                            <Box sx={{ width: "100px" }}>
                              <Typography
                                variant="subtitle2"
                                color={
                                  item.rowStatus === "standby"
                                    ? "error.main"
                                    : "text.primary"
                                }
                              >
                                {item.name}
                              </Typography>
                            </Box>
                            {Object.entries(AttendStatusTemplate).map(
                              ([k, v]) => (
                                <Box
                                  key={k} // key prop 추가
                                  style={{
                                    display: "flex",
                                    flexShrink: 0,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  sx={{ px: 0.5 }}
                                >
                                  {item.rowStatus === "standby" ? (
                                    <Button
                                      fullWidth
                                      size="medium"
                                      variant="outlined"
                                      // disabled={k === "needCharge"}
                                      onClick={() =>
                                        handleButtonClick(
                                          item.id,
                                          k as AttendStatus
                                        )
                                      }
                                      sx={{
                                        "&:hover": {
                                          background:
                                            event[item.id as string] &&
                                            event[item.id as string] === k
                                              ? theme.palette.text.disabled
                                              : getColor(v.color),
                                        },
                                        pointerEvents:
                                          k === "needCharge" ? "none" : "auto",
                                        color: "primary.contrastText",
                                        background:
                                          event[item.id as string] &&
                                          event[item.id as string] === k
                                            ? getColor(v.color)
                                            : theme.palette.text.disabled,
                                        borderRadius: 1,
                                        pr: 1,
                                        pl: 1,
                                        border: `2px solid ${event[item.id as string] && event[item.id as string] === k ? getColor(v.color) : theme.palette.grey[200]}`,
                                      }}
                                    >
                                      {v.name}
                                    </Button>
                                  ) : (
                                    <Button
                                      fullWidth
                                      size="medium"
                                      variant="outlined"
                                      sx={{
                                        pointerEvents: "none",
                                        // pointerEvents: item.rowStatus !== k ? "none" : "auto", // 결제처리 가능성 존재하여 none으로 안둠
                                        color: "primary.contrastText",
                                        background:
                                          item.rowStatus === k
                                            ? getColor(v.color)
                                            : theme.palette.text.disabled,
                                        borderRadius: 1,
                                        pr: 1,
                                        pl: 1,
                                        border: `2px solid ${item.rowStatus === k ? getColor(v.color) : theme.palette.text.disabled}`,
                                      }}
                                    >
                                      {v.name}
                                    </Button>
                                  )}
                                </Box>
                              )
                            )}
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "start",
                                height: "40px",
                              }}
                            >
                              {event[item.id as string] === "excused" ||
                              item.excusedDate ? (
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
                                      color="text.primary"
                                      sx={{ ml: 1, mr: 1 }}
                                    >
                                      보강날짜
                                    </Typography>
                                    <TextField
                                      id="schedule-end"
                                      type="date"
                                      disabled={Boolean(item.excusedDate)}
                                      value={eventTime[item.id as string] ?? ""}
                                      onChange={(e) => {
                                        setEventTime((prev) => ({
                                          ...prev,
                                          [item.id as string]: e.target
                                            .value as string,
                                        }));
                                      }}
                                      sx={{
                                        borderColor: "#d2d2d2",
                                        borderRadius: 1,
                                        height: 20,
                                        fontSize: 12,
                                      }}
                                      InputProps={{
                                        style: { height: 20, fontSize: 12 },
                                      }}
                                    />
                                  </Box>
                                </Box>
                              ) : (
                                ""
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </>
          )}
        </Box>
        {target.length ? (
          <Box sx={{ display: "flex", justifyContent: "start", ml: 1, p: 2 }}>
            <Button
              variant="outlined"
              size="medium"
              disabled={processing}
              sx={{
                pl: 1,
                pr: 1,
                mr: 0.5,
                mb: 1,
                borderRadius: 1,
                border: (theme) => `1.5px solid ${theme.palette.grey[100]}`,
                borderColor: "success.main",
                color: "success.main",
              }}
              onClick={() => {
                if (!Object.entries(event).length)
                  return toast.error("출석 대상자의 내용을 선택해주세요");
                setOpen(true);
              }}
            >
              {processing ? (
                <CircularProgress color="inherit" size={14} sx={{ mr: 1 }} />
              ) : (
                <HowToRegIcon
                  style={{ fontSize: 20 }}
                  sx={{
                    mr: 1,
                    background: (theme) => theme.palette.success.main,
                    color: "background.default",
                    borderRadius: 50,
                  }}
                />
              )}
              일괄 출석 처리하기
            </Button>
          </Box>
        ) : null}
      </Box>
      <AlertModal
        open={open}
        handleClose={handleClose}
        onClickCheck={onClickSaveAttendinfo}
        title="출석 일괄처리"
        content="선택한 인원들을 일괄 처리 하시겠습니까?"
      ></AlertModal>
    </>
  );
};

export default AttendanceCheck;
