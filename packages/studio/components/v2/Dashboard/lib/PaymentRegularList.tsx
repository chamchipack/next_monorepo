import { useCallback, useEffect, useState } from "react";
import { PaymentRows } from ".";
import db from "@/api/module";
import { Class } from "@/config/type/default/class";
import moment from "moment";
import { PaymentStatus } from "../../Payment/lib";
import { Student } from "@/config/type/default/students";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Typography,
  alpha,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import LightTooltip from "@/components/common/Tooltip/LightTooltip";
import ErrorIcon from "@mui/icons-material/Error";
import { CircleSharp } from "@mui/icons-material";
import AlertModal from "../../Alert/Modal";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRecoilValue } from "recoil";
import EditAccessAtom from "@/config/type/access/state";

type ClassData = {
  [key: string]: { name: string; price: number };
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PaymentRegularList = () => {
  const { data: session } = useSession();
  const editAccessState = useRecoilValue(EditAccessAtom);

  const [rows, setRows] = useState<PaymentRows[]>([]);
  const [classData, setClassData] = useState<ClassData>({});
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleChange = (event: any) => {
    setPaymentMethod(event.target.value);
  };

  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const onLoadClassData = useCallback(async (): Promise<ClassData> => {
    const { data: items } = await db.search("class", { options: {} });
    const result = items.reduce((acc: ClassData, item: Class) => {
      acc = {
        ...acc,
        [item?.id as string]: { name: item.name, price: item.price },
      };
      return acc;
    }, {});
    setClassData(result);
    return result;
  }, []);

  const handleSubmit = async () => {
    if (!paymentMethod) return toast.error("결제 방식을 선택해주세요");
    setProcessing(true);

    const row: PaymentRows | undefined = rows.find(
      ({ id = "" }) => id === selectedId
    );

    if (!row?.id) return;
    try {
      const { id = "", ...rest } = row;

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
        paymentYearMonth: moment().format("YYYY-MM"),
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
      await delay(200);
      const left = rows.filter(({ id: _id = "" }) => _id !== row.id);
      setRows(left);
      toast.success("정상적으로 처리 되었습니다.");
    } catch (e) {
      console.info(e);
      toast.error("저장에 실패했습니다.");
    }
    handleClose();
    setSelectedId("");

    setProcessing(false);
  };

  const onLoadRegularData = useCallback(async () => {
    setLoading(true);
    try {
      let _classData = classData;
      if (!Object.entries(classData).length)
        _classData = await onLoadClassData();

      const { data: paymentItems } = await db.search("payment", {
        options: {
          "paymentYearMonth.like": moment().format("YYYY-MM"),
          "paymentType.equal": "regular",
        },
      });
      await delay(500);

      const paymentObject = paymentItems.reduce(
        (acc: object, { studentId = "", ...rest }) => {
          Object.assign(acc, { [studentId]: { ...rest } });
          return acc;
        },
        {}
      );

      const classArray = Object.entries(_classData).map(([k, v]) => ({
        id: k,
        ...v,
      }));

      const { data: studentItems } = await db.search("student", {
        options: {
          "paymentType.equal": "regular",
          "currentStatus.like": true,
          "enrollmentDate.lte": moment().add(1, "month").format("YYYY-MM-DD"),
        },
      });

      const result: PaymentRows[] = studentItems.reduce(
        (acc: PaymentRows[], data: Student) => {
          const { id = "", classId = [] } = data;

          let rowStatus: PaymentStatus = "completed";

          if (paymentObject[id]) rowStatus = "completed";
          else {
            acc.push({
              ...data,
              classId,
              price:
                classArray.find(({ id: cid }) => classId.includes(cid))
                  ?.price || 0,
              rowStatus: "needCharge",
            });
          }
          return acc;
        },
        []
      );

      setRows(result);
    } catch (e) {
      console.info(e);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    onLoadRegularData();
  }, [onLoadRegularData]);

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
        <>
          {!rows.length ? (
            <Alert severity="warning" variant="outlined" sx={{ my: 1 }}>
              <Typography variant="body1">결제 대상자가 없습니다.</Typography>
            </Alert>
          ) : (
            <>
              <AnimatePresence>
                {rows.map(
                  ({
                    id = "",
                    name = "",
                    regularPayment = {},
                    rowStatus = "completed",
                    type = "",
                  }) => (
                    <Box
                      key={id}
                      sx={{ mb: 0.5 }}
                      component={motion.div}
                      exit={{
                        opacity: 0,
                        height: 0,
                        transition: { duration: 0.2 },
                      }}
                      animate={{
                        opacity: processing && selectedId === id ? 0 : 1,
                        x: processing && selectedId === id ? "-100%" : 0,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                        sx={{
                          opacity: processing && id === selectedId ? 0.1 : 1,
                          py: 1,
                          borderBottom: (theme) =>
                            `1px solid ${alpha(theme.palette.text.secondary, 0.2)}`,
                        }}
                      >
                        <div style={{ flexGrow: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: (theme) => theme.palette.grey[800],
                              mr: 1,
                            }}
                          >
                            {name}{" "}
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.disabled"
                            >
                              {type === "lesson" ? "레슨" : ("수업" ?? "")}
                            </Typography>
                          </Typography>

                          <Box
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.disabled"
                                sx={{ mr: 1 }}
                              >
                                마지막 결제일
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                variant="caption"
                                color="secondary.main"
                              >
                                {regularPayment?.lastPaymentDate
                                  ? `${regularPayment?.lastPaymentDate}`
                                  : "미등록"}
                              </Typography>
                            </Box>
                          </Box>
                        </div>

                        <Box
                          style={{
                            display: "flex",
                            flexShrink: 0,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          sx={{ px: 0.5 }}
                        >
                          <LightTooltip
                            title={
                              <Box sx={{ p: 1 }}>
                                <Box
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <ErrorIcon
                                    sx={{ color: "info.main", mr: 1 }}
                                  />
                                  <Typography variant="h5" color="info.main">
                                    결제처리
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: (theme) => theme.palette.grey[700],
                                  }}
                                >
                                  즉시 결제 처리가 됩니다.
                                </Typography>
                              </Box>
                            }
                          >
                            <Button
                              fullWidth
                              size="medium"
                              variant="outlined"
                              disabled={
                                id === selectedId ||
                                processing ||
                                !editAccessState
                              }
                              sx={{
                                color: "primary.dark",
                                pl: 1,
                                pr: 1,
                                borderRadius: 4,
                                border: (theme) =>
                                  `1px solid ${theme.palette.grey["A100"]}`,
                              }}
                              onClick={() => {
                                if (rowStatus === "completed") return;
                                setSelectedId(id);
                                setOpen(true);
                              }}
                            >
                              <CircleSharp
                                style={{ fontSize: 6 }}
                                sx={{
                                  color: "primary.dark",
                                  mr: 1,
                                }}
                              />
                              결제처리
                            </Button>
                          </LightTooltip>
                        </Box>
                      </Box>
                    </Box>
                  )
                )}
              </AnimatePresence>
            </>
          )}
        </>
      )}

      <AlertModal
        open={open}
        handleClose={handleClose}
        onClickCheck={() => handleSubmit()}
        title={`수강생 결제처리`}
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

export default PaymentRegularList;
