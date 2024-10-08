import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  CircularProgress,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  alpha,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Rows } from ".";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { AnimatePresence } from "framer-motion";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useSession } from "next-auth/react";
import AlertModal from "../../Alert/Modal";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import db from "@/api/module";
import { useRecoilValue } from "recoil";
import PaymentDataAtom from "./state";
import { SearchSharp } from "@mui/icons-material";
import EditAccessAtom from "@/config/type/access/state";
import { useClientSize } from "package/src/hooks/useMediaQuery";

interface Props {
  rows: Rows[];
  getRows: () => void;
}

type ClickEvent = {
  [id: string]: string;
};

const Regular = ({ rows, getRows }: Props) => {
  const { data: session } = useSession();
  const editAccessState = useRecoilValue(EditAccessAtom);
  const isMobile = useClientSize("sm");

  const [target, setTarget] = useState<Rows[]>(rows);
  const [data, setData] = useState<Rows>();
  const [event, setEvent] = useState<ClickEvent>({});
  const [processing, setProcessing] = useState(false);

  const dateState = useRecoilValue(PaymentDataAtom);
  const [isClicked, setIsClicked] = useState(false);
  const searchKeywordRef = useRef<HTMLInputElement>(null);

  const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ("Enter" === e.key) {
      e.preventDefault();

      if (!searchKeywordRef.current?.value) setTarget(rows);
      else
        setTarget(
          rows.filter(
            ({ name }) => name === (searchKeywordRef.current?.value as string)
          )
        );
    }
  };

  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleChange = (event: any) => {
    setPaymentMethod(event.target.value);
  };

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setEvent({});
  }, [dateState.paymentDate]);

  const handleButtonClick = (id: string | undefined, name: string) => {
    if (!id) return;

    setEvent((prev) => {
      if (prev[id] && prev[id] === name) {
        const { [id]: _, ...rest } = prev; // id를 제거한 새로운 객체를 만듦
        return rest;
      } else {
        return {
          ...prev,
          [id]: name,
        };
      }
    });
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async (multiple = false) => {
    if (!paymentMethod) return toast.error("결제 방식을 선택해주세요");
    setProcessing(true);

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const paymentTarget = multiple
      ? target.filter((item) => event[item.id as string])
      : [data!];

    try {
      for (let item of paymentTarget) {
        const { id = "", ...rest } = item;
        if (!id) continue;

        const paymentForm = {
          studentId: id,
          studentName: rest.name,
          sessionId: rest.sessionId[0] || "",
          sessionName: "",
          classId: rest.classId[0] || "",
          className: "",
          instructorId: "",
          confirmationId: session?.user?.id || "",
          paymentDate: moment().format("YYYY-MM-DD HH:mm:ss"),
          paymentType: rest.paymentType,
          confirmationDate: moment().format("YYYY-MM-DD HH:mm:ss"),
          paymentYearMonth: moment(dateState.paymentDate).format("YYYY-MM"),
          amount: rest?.price ?? 0,
          method: paymentMethod,
        };

        const lastDay =
          rest?.regularPayment?.nextDueDate || moment().format("YYYY-MM-DD");

        const studentForm = {
          id,
          regularPayment: {
            lastPaymentDate: lastDay,
            nextDueDate: moment(lastDay).add(1, "months").format("YYYY-MM-DD"),
          },
        };

        await db.update("student", studentForm);
        await delay(500);
        await db.create("payment", paymentForm);
        await delay(500);
      }
      getRows();
      toast.success("정상적으로 처리 되었습니다.");
    } catch {
      toast.error("저장에 실패했습니다.");
    }
    handleClose();

    setProcessing(false);
  };

  return (
    <>
      <Box
        sx={{
          minWidth: "90%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          p: 0,
          // position: "sticky",
          zIndex: 99,
          top: 0,
          height: "15%",
          background: (theme) => theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            sx={{ width: "120px", mt: 1, mb: 2, height: "20px" }}
          >
            <Button
              fullWidth
              size="medium"
              variant="outlined"
              sx={{
                color: "text.secondary",
                background: (theme) =>
                  isClicked
                    ? theme.palette.primary.main
                    : theme.palette.grey[100],
                borderRadius: 3,
                pr: 1,
                pl: 1,
                border: (theme) =>
                  isClicked
                    ? theme.palette.primary.main
                    : theme.palette.grey[100],
              }}
              onClick={() => {
                setIsClicked(!isClicked);
                setTarget(
                  isClicked
                    ? rows
                    : target.filter(
                        ({ rowStatus }) => rowStatus === "needCharge"
                      )
                );
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
              미결제자 표시
            </Button>
          </Box>
          <Box sx={{ mb: 2 }}>
            {Object.entries(event).length ? (
              <Typography
                component="span"
                variant="subtitle2"
                color="secondary.dark"
              >
                {Object.values(event).reduce((acc, item) => {
                  // acc += item.reduce((a: string, v: string) => (a += `#${v} `), "");
                  acc += `#${item} `;
                  // if (key === "district" && !value.length) acc += "#전체 ";
                  return acc;
                }, "")}
              </Typography>
            ) : (
              ""
            )}
          </Box>
        </Box>
        {!isMobile && (
          <Box>
            <FormControl
              size="small"
              style={{ marginLeft: "auto", maxWidth: "300px" }}
            >
              <OutlinedInput
                id="search"
                inputRef={searchKeywordRef}
                placeholder="이름을 입력해주세요"
                sx={{
                  borderRadius: 8,
                  border: (theme) => `2px solid ${theme.palette.primary.main}`,
                  "> fieldset": { border: 0 },
                }}
                type="text"
                onKeyDown={handleKeyDownSearch}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => {
                        if (!searchKeywordRef.current?.value) setTarget(rows);
                        else
                          setTarget(
                            rows.filter(
                              ({ name }) =>
                                name ===
                                (searchKeywordRef.current?.value as string)
                            )
                          );
                      }}
                      onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
                        e.preventDefault()
                      }
                      aria-label="search"
                    >
                      <SearchSharp color="primary" />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
        )}
      </Box>
      <Box sx={{ height: "85%" }}>
        {target.length ? (
          <>
            <AnimatePresence>
              <Grid container spacing={2}>
                {target.map((item) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={item.id}
                    sx={{ mb: 1 }}
                  >
                    <Card
                      onClick={() => {
                        if (item.rowStatus !== "needCharge") return;
                        handleButtonClick(item.id, item.name as string);
                      }}
                      sx={{
                        cursor:
                          item.rowStatus === "needCharge" ? "pointer" : "",
                        "&:hover": {
                          background: (theme) =>
                            item.rowStatus === "needCharge"
                              ? event[item.id as string]
                                ? `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.success.light})`
                                : `linear-gradient(to right, ${theme.palette.info.main}, ${theme.palette.secondary.main})`
                              : alpha(theme.palette.grey[400], 0.8),
                        },
                        maxWidth: "100%",
                        background: (theme) =>
                          item.rowStatus === "needCharge"
                            ? event[item.id as string]
                              ? `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.success.main})`
                              : `linear-gradient(to right, ${theme.palette.info.main}, ${theme.palette.secondary.dark})`
                            : alpha(theme.palette.grey[400], 0.8),
                        p: 1,
                        boxShadow: 3,
                        borderRadius: 3,
                      }}
                    >
                      <CardContent
                        sx={{
                          // background: (theme) =>
                          //   item.rowStatus === "needCharge"
                          //     ? theme.palette.secondary.light
                          //     : theme.palette.background.default,
                          borderRadius: 3,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
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
                        <Box
                          sx={{
                            display: "flex",
                            mt: 0.5,
                            flexDirection: "row",
                          }}
                        >
                          <Chip
                            sx={{
                              borderWidth: 2,
                              mr: 1,
                              color: "white",
                              borderColor: "white",
                            }}
                            size="small"
                            variant="outlined"
                            label={item.type === "lesson" ? "레슨" : "수업"}
                            // color={
                            //   item.type === "lesson" ? "primary" : "success"
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
                      </CardContent>
                      <Box sx={{ p: 1, pl: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            component="span"
                            variant="caption"
                            color="white"
                            sx={{ mr: 1.5 }}
                          >
                            최근 결제일{" "}
                          </Typography>
                          <Typography
                            component="span"
                            variant="subtitle2"
                            color="white"
                          >
                            {item.regularPayment.lastPaymentDate || "-"}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ my: 1, display: "flex", alignItems: "center" }}
                        >
                          <Typography
                            component="span"
                            variant="caption"
                            color="white"
                            sx={{ mr: 1.5 }}
                          >
                            다음 예상일{" "}
                          </Typography>
                          <Typography
                            component="span"
                            variant="subtitle2"
                            color={
                              moment().format("YYYY-MM-DD") ===
                              item.regularPayment.nextDueDate
                                ? "error.main"
                                : "white"
                            }
                          >
                            {item.regularPayment.nextDueDate || "-"}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                          fullWidth
                          size="medium"
                          variant="outlined"
                          disabled={
                            Object.entries(event).length > 1 || !editAccessState
                          }
                          onClick={(e) => {
                            e.stopPropagation(); // 부모 요소의 onClick 이벤트가 실행되지 않도록 함
                            setData(item);
                            setOpen(true);
                          }}
                          sx={{
                            width: 150,
                            "&:hover": {
                              backgroundColor: (theme) =>
                                theme.palette.warning.dark,
                              border: (theme) =>
                                `2px solid ${item.rowStatus === "needCharge" ? theme.palette.warning.dark : theme.palette.grey[200]}`,
                            },
                            pointerEvents:
                              item.rowStatus === "needCharge" ? "auto" : "none",
                            color: "primary.contrastText",
                            background: (theme) =>
                              item.rowStatus === "needCharge"
                                ? theme.palette.warning.main
                                : theme.palette.text.disabled,
                            borderRadius: 1,
                            pr: 1,
                            pl: 1,
                            border: (theme) =>
                              `2px solid ${item.rowStatus === "needCharge" ? theme.palette.warning.main : theme.palette.grey[200]}`,
                          }}
                        >
                          {item.rowStatus === "completed"
                            ? `${moment(dateState.paymentDate).format("M월")} 결제완료`
                            : "결제하기"}
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AnimatePresence>
          </>
        ) : (
          <Alert severity="warning" variant="outlined" sx={{ my: 1 }}>
            <Typography variant="body1">결제 대상자가 없습니다.</Typography>
          </Alert>
        )}
      </Box>

      {target.length && editAccessState && Object.entries(event).length > 1 ? (
        <Box
          sx={{
            background: (theme) => theme.palette.background.default,
            display: "flex",
            justifyContent: "start",
            // position: "sticky",
            bottom: 0,
            mt: 2,
            p: 1,
            width: "100%",
            height: 40,
          }}
        >
          <Box>
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
              onClick={() => setOpen(true)}
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
              다중 결제 처리하기
            </Button>
          </Box>
        </Box>
      ) : null}

      <AlertModal
        open={open}
        handleClose={handleClose}
        onClickCheck={() => handleSubmit(Object.entries(event).length > 1)}
        title={`${Object.entries(event).length < 2 ? data?.name : "다중"} 수강생 결제처리`}
        content={`아래의 결제 방식을 선택해주세요`}
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
              결제 방법
            </InputLabel>
            <Select
              labelId="payment-select-label"
              id="payment-select"
              value={paymentMethod}
              onChange={handleChange}
              label="결제 방법"
              sx={{ fontSize: 14, height: 30 }}
            >
              <MenuItem value="card">카드</MenuItem>
              <MenuItem value="cash">현금</MenuItem>
              <MenuItem value="account">계좌</MenuItem>
              <MenuItem value="other">기타</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </AlertModal>
    </>
  );
};

export default Regular;
