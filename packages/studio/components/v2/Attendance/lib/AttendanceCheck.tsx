import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  InputLabel,
  Skeleton,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { AttendStatus, AttendStatusTemplate, Rows, AttendEnums } from ".";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DangerousIcon from "@mui/icons-material/Dangerous";
import MoreIcon from "@mui/icons-material/More";
import AddTaskIcon from "@mui/icons-material/AddTask";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AttendanceDataAtom from "./state";
import { useRecoilState, useRecoilValue } from "recoil";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import db from "@/api/module";
import { useSession } from "next-auth/react";
import AlertModal from "../../Alert/Modal";
import EditAccessAtom from "@/config/type/access/state";
import { useClientSize } from "package/src/hooks/useMediaQuery";

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
  const isMobile = useClientSize("sm");

  const [target, setTarget] = useState<Rows[]>(rows);
  const [event, setEvent] = useState<ClickEvent>({}); // 초기값을 빈 객체로 설정
  const [eventTime, setEventTime] = useState<ClickTimeEvent>({});
  const [selectedRow, setSelectedRow] = useState<Rows>();
  const [isClicked, setIsClicked] = useState(false);
  const [isChargeClicked, setIsChargeClicked] = useState(false);

  const [processing, setProcessing] = useState(false);
  const [open, setOpen] = useState(false);

  const [dateState, setDateState] = useRecoilState(AttendanceDataAtom);
  const editAccessState = useRecoilValue(EditAccessAtom);

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
      if (item.excusedDate)
        acc = { ...acc, [item.id as string]: item.excusedDate };
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
        if (!event[id]) continue;

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
          attendanceDate: moment(
            `${dateState.attendanceDate} ${rest?.lessonTime?.stime}`
          ).format("YYYY-MM-DD HH:mm:ss"),
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
              over = 0,
              isPaid,
            } = rest?.lessonBasedPayment;
            const studentForm = {
              id,
              lessonBasedPayment: {
                total,
                remaining: remaining > 0 ? remaining - 1 : 0,
                over: !isPaid && !remaining ? over + 1 : over,
                isPaid: remaining > 1 ? true : false,
              },
            };

            await db.update("student", studentForm);
          }

          await delay(500);
        }
      }
      load();
    } catch {
      toast.error("오류가 발생했습니다.");
    }

    setProcessing(false);
    setOpen(false);
    toast.success("정상적으로 처리 되었습니다.");
  };

  useEffect(() => {
    setEvent({});
    setEventTime({});
  }, [dateState.attendanceDate]);

  return (
    <>
      <Box
        sx={{
          // border: (theme) => `1px solid ${theme.palette.grey[100]}`,
          borderRadius: 2,
          height: "100%",
        }}
      >
        <Box sx={{ mt: 1, p: 1, height: "100%" }}>
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

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "start",
                }}
              >
                <Skeleton
                  variant="rounded"
                  width={320}
                  height={160}
                  sx={{ mt: 1, mr: 2 }}
                />
                <Skeleton
                  variant="rounded"
                  width={320}
                  height={160}
                  sx={{ mt: 1, mr: 2 }}
                />
                <Skeleton
                  variant="rounded"
                  width={320}
                  height={160}
                  sx={{ mt: 1, mr: 2 }}
                />
                <Skeleton
                  variant="rounded"
                  width={320}
                  height={160}
                  sx={{ mt: 1, mr: 2 }}
                />
              </Box>
            </>
          ) : (
            <>
              {!target.length ? (
                <>
                  <Box sx={{ mb: 2, minHeight: 40 }}>
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
                    {!isMobile && (
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
                                  ({ rowStatus }) => rowStatus === "standby"
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
                    )}
                  </Box>
                  <Alert severity="warning" variant="outlined" sx={{ my: 1 }}>
                    <Typography variant="body1">대상자가 없습니다.</Typography>
                  </Alert>
                </>
              ) : (
                <Box sx={{ height: "100%" }}>
                  <Box
                    sx={{
                      mb: 2,
                      minHeight: 40,
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
                        <Typography
                          component="span"
                          variant="subtitle1"
                          color="info.main"
                          sx={{ ml: 1 }}
                        >
                          {rows.length ?? 0} 명
                        </Typography>
                      </Typography>
                    </Typography>
                    {!isMobile && (
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
                                  target.filter(({ rowStatus }) =>
                                    ["standby", "needCharge"].includes(
                                      rowStatus
                                    )
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
                                background: (theme) =>
                                  theme.palette.warning.main,
                                mr: 1,
                              }}
                            />
                            {isClicked ? "전체 표시하기" : "미출석만 표시"}
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Box>
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      overflowY: "auto",
                      height: isMobile ? "90%" : "85%",
                    }}
                  >
                    {target.map((item, index) => (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        key={`_${item.id}`}
                        sx={{ mb: 1, px: 1 }}
                      >
                        <Card
                          sx={{
                            p: 1,
                            maxWidth: "100%",
                            background: (theme) =>
                              item.rowStatus === "needCharge"
                                ? alpha(theme.palette.grey[300], 0.6)
                                : `linear-gradient(to right, ${theme.palette.info.main}, ${theme.palette.secondary.dark})`,
                            boxShadow: 2,
                            borderRadius: 3,
                          }}
                        >
                          <CardContent
                            sx={{
                              // background: (theme) =>
                              //   item.rowStatus === "needCharge"
                              //     ? theme.palette.background.default
                              //     : theme.palette.secondary.light,
                              borderRadius: 3,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                height: 30,
                              }}
                            >
                              <Typography
                                gutterBottom
                                variant="subtitle1"
                                component="div"
                                color="background.default"
                              >
                                {item.name}
                              </Typography>
                              <FormControlLabel
                                labelPlacement="start"
                                label={
                                  Boolean(event[item.id as string]) ? (
                                    <Typography
                                      variant="caption"
                                      color="background.default"
                                    >
                                      선택됨
                                    </Typography>
                                  ) : (
                                    ""
                                  )
                                }
                                control={
                                  <Checkbox
                                    color="warning"
                                    sx={{
                                      "& .MuiSvgIcon-root": { fontSize: 16 }, // 아이콘 크기 조정
                                    }}
                                    checked={Boolean(event[item.id as string])}
                                  />
                                }
                              />
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Box>
                                <Chip
                                  sx={{
                                    borderWidth: 2,
                                    mr: 1,
                                    color: "white",
                                    borderColor: "white",
                                  }}
                                  size="small"
                                  variant="outlined"
                                  label={
                                    item.type === "lesson" ? "레슨" : "수업"
                                  }
                                  // color={
                                  //   item.type === "lesson"
                                  //     ? "primary"
                                  //     : "success"
                                  // }
                                />
                                <Chip
                                  sx={{
                                    borderWidth: 2,
                                    color:
                                      item.paymentType === "regular"
                                        ? "white"
                                        : "warning.main",
                                    borderColor:
                                      item.paymentType === "regular"
                                        ? "white"
                                        : "warning.main",
                                  }}
                                  size="small"
                                  variant="outlined"
                                  label={
                                    item.paymentType === "regular"
                                      ? "정기결제"
                                      : "회차결제"
                                  }
                                  // color={
                                  //   item.paymentType === "regular"
                                  //     ? "info"
                                  //     : "warning"
                                  // }
                                />
                              </Box>
                              <Box>
                                {item.paymentType === "package" ? (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {item.lessonBasedPayment.remaining}회
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ mx: 0.5 }}
                                    >{` / `}</Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {item.lessonBasedPayment.total} 회 남음
                                    </Typography>
                                  </Box>
                                ) : null}
                              </Box>
                            </Box>
                          </CardContent>

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              mt: 1,
                            }}
                          >
                            <Box sx={{ width: "100%", p: 1 }}>
                              <Grid container spacing={2}>
                                {Object.entries(AttendStatusTemplate).map(
                                  ([k, v]) => (
                                    <Grid
                                      item
                                      xs={3}
                                      sm={2}
                                      md={4}
                                      lg={3}
                                      key={`${k}_`}
                                    >
                                      <Box
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
                                              maxWidth: 60,
                                              height: 60,
                                              display: "flex",
                                              flexDirection: "column",
                                              "&:hover": {
                                                "&:hover": {
                                                  background: getColor(v.color),
                                                  border: `2px solid ${getColor(v.color)}`,
                                                },
                                              },
                                              pointerEvents:
                                                k === "needCharge"
                                                  ? "none"
                                                  : "auto",
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
                                            <Box>
                                              {k === "present" ? (
                                                <CheckCircleOutlineIcon />
                                              ) : k === "late" ? (
                                                <WatchLaterIcon />
                                              ) : k === "excused" ? (
                                                <AddTaskIcon />
                                              ) : k === "absent" ? (
                                                <DangerousIcon />
                                              ) : (
                                                <MoreIcon />
                                              )}
                                            </Box>
                                            <Box>{v.name}</Box>
                                          </Button>
                                        ) : (
                                          <>
                                            {item.rowStatus === "needCharge" ? (
                                              <Button
                                                fullWidth
                                                size="medium"
                                                variant="outlined"
                                                onClick={() =>
                                                  handleButtonClick(
                                                    item.id,
                                                    k as AttendStatus
                                                  )
                                                }
                                                sx={{
                                                  "&:hover": {
                                                    background: getColor(
                                                      v.color
                                                    ),
                                                    border: `2px solid ${getColor(v.color)}`,
                                                  },
                                                  maxWidth: 80,
                                                  height: 60,
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  // pointerEvents: "none",
                                                  // pointerEvents: item.paymentType === "regular" ? "auto" : "none", // 결제처리 가능성 존재하여 none으로 안둠
                                                  color: "primary.contrastText",
                                                  background:
                                                    event[item.id as string] ===
                                                    k
                                                      ? getColor(v.color)
                                                      : theme.palette.text
                                                          .disabled,
                                                  borderRadius: 1,
                                                  pr: 1,
                                                  pl: 1,
                                                  border: `2px solid ${event[item.id as string] === k ? getColor(v.color) : theme.palette.text.disabled}`,
                                                }}
                                              >
                                                <Box>
                                                  {k === "present" ? (
                                                    <CheckCircleOutlineIcon />
                                                  ) : k === "late" ? (
                                                    <WatchLaterIcon />
                                                  ) : k === "excused" ? (
                                                    <AddTaskIcon />
                                                  ) : k === "absent" ? (
                                                    <DangerousIcon />
                                                  ) : (
                                                    <MoreIcon />
                                                  )}
                                                </Box>
                                                <Box>{v.name}</Box>
                                              </Button>
                                            ) : (
                                              <Button
                                                fullWidth
                                                size="medium"
                                                variant="outlined"
                                                sx={{
                                                  "&:hover": {
                                                    background: getColor(
                                                      v.color
                                                    ),
                                                    border: `2px solid ${getColor(v.color)}`,
                                                  },
                                                  maxWidth: 80,
                                                  height: 60,
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  pointerEvents: "none",
                                                  // pointerEvents: item.rowStatus !== k ? "none" : "auto", // 결제처리 가능성 존재하여 none으로 안둠
                                                  color: "primary.contrastText",
                                                  background:
                                                    item.rowStatus === k
                                                      ? getColor(v.color)
                                                      : theme.palette.text
                                                          .disabled,
                                                  borderRadius: 1,
                                                  pr: 1,
                                                  pl: 1,
                                                  border: `2px solid ${item.rowStatus === k ? getColor(v.color) : theme.palette.text.disabled}`,
                                                }}
                                              >
                                                <Box>
                                                  {k === "present" ? (
                                                    <CheckCircleOutlineIcon />
                                                  ) : k === "late" ? (
                                                    <WatchLaterIcon />
                                                  ) : k === "excused" ? (
                                                    <AddTaskIcon />
                                                  ) : k === "absent" ? (
                                                    <DangerousIcon />
                                                  ) : (
                                                    <MoreIcon />
                                                  )}
                                                </Box>
                                                <Box>{v.name}</Box>
                                              </Button>
                                            )}
                                          </>
                                        )}
                                      </Box>
                                    </Grid>
                                  )
                                )}
                              </Grid>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  height: "40px",
                                }}
                              >
                                <Box>
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
                                          color="white"
                                          sx={{ ml: 1, mr: 1 }}
                                        >
                                          보강날짜
                                        </Typography>
                                        <TextField
                                          id="schedule-end"
                                          type="date"
                                          disabled={Boolean(item.excusedDate)}
                                          value={
                                            eventTime[item.id as string] ?? ""
                                          }
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
                                            style: {
                                              color: "white",
                                              height: 20,
                                              fontSize: 12,
                                            },
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                  ) : null}
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "end",
                                    p: 1,
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    color={
                                      item.rowStatus === "needCharge"
                                        ? "error.main"
                                        : "background.default"
                                    }
                                  >
                                    {item.rowStatus === "needCharge"
                                      ? "결제가 필요합니다"
                                      : item.rowStatus === "standby"
                                        ? ""
                                        : "출석완료"}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </>
          )}
          {target.length && editAccessState ? (
            <Box sx={{ display: "flex", justifyContent: "start", mt: 1 }}>
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
      </Box>
      <AlertModal
        open={open}
        handleClose={handleClose}
        onClickCheck={onClickSaveAttendinfo}
        title="출석 일괄처리"
        content="선택한 인원들을 일괄 처리 하시겠습니까?"
        processing={processing}
      ></AlertModal>
    </>
  );
};

export default AttendanceCheck;
