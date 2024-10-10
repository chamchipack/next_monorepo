import EditAccessAtom from "@/config/type/access/state";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { PaymentRows } from ".";
import db from "@/api/module";
import { Class } from "@/config/type/default/class";
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
import moment from "moment";

type ClassData = {
  [key: string]: { name: string; price: number };
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PaymentPackageList = () => {
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

  const onLoadPackageData = useCallback(async () => {
    setLoading(true);

    let _classData = classData;
    if (!Object.entries(classData).length) _classData = await onLoadClassData();

    const classArray = Object.entries(_classData).map(([k, v]) => ({
      id: k,
      ...v,
    }));

    const { data: studentItems } = await db.search("student", {
      options: {
        "lessonBasedPayment.isPaid.equal": false,
        "currentStatus.like": true,
      },
    });
    await delay(100);
    if (!studentItems.length) {
      setLoading(false);
      setRows([]);
    }

    const result: PaymentRows[] = studentItems.map((data: Student) => ({
      ...data,
      rowStatus: "needCharge",
      price:
        classArray.find(({ id: cid }) => data?.classId.includes(cid))?.price ||
        0,
    }));

    setRows(result);
    setLoading(false);
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
        studentId: id || "",
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
        method: paymentMethod, // cash, card, account
      };

      const studentForm = {
        id,
        lessonBasedPayment: {
          isPaid: true,
          over: 0,
          remaining: rest.lessonBasedPayment?.over
            ? (rest.lessonBasedPayment.total as number) -
              rest.lessonBasedPayment?.over
            : rest.lessonBasedPayment.total,
          total: rest.lessonBasedPayment.total,
        },
      };

      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      await db.update("student", studentForm);

      await delay(500);

      await db.create("payment", paymentForm);

      // await delay(500);

      const left = rows.filter(({ id: _id = "" }) => _id !== row.id);
      setRows(left);
      toast.success("정상적으로 처리 되었습니다.");
    } catch {
      toast.error("저장에 실패했습니다.");
    }

    handleClose();
    setSelectedId("");

    setProcessing(false);
  };

  useEffect(() => {
    onLoadPackageData();
  }, [onLoadPackageData]);
  return (
    <>
      {loading ? (
        <>
          {[...Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height={60}
              sx={{ mb: 0.5 }}
            />
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
                    rowStatus = "",
                    lessonBasedPayment = {},
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
                          py: 1,
                          opacity: processing && id === selectedId ? 0.1 : 1,
                          borderBottom: (theme) =>
                            `1px solid ${alpha(theme.palette.text.secondary, 0.2)}`,
                        }}
                      >
                        <div style={{ flexGrow: 1 }}>
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
                              {/* {Position[position] ?? ""} */}
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
                                color="text.secondary"
                              >
                                기준 레슨 횟수{" "}
                                <Typography variant="caption" color="info.main">
                                  {lessonBasedPayment?.total}
                                </Typography>
                                회
                              </Typography>
                            </Box>
                            {/* <Box>
                            <ButtonBase>
                              <Typography variant="caption" color="info.main">
                                상세보기
                              </Typography>
                            </ButtonBase>
                          </Box> */}
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
                              disabled={id === selectedId || !editAccessState}
                              onClick={() => {
                                if (rowStatus === "completed") return;
                                setSelectedId(id);
                                setOpen(true);
                              }}
                              sx={{
                                color: "secondary.dark",
                                pl: 1,
                                pr: 1,
                                borderRadius: 4,
                                border: (theme) =>
                                  `1px solid ${theme.palette.grey["A200"]}`,
                              }}
                            >
                              <CircleSharp
                                style={{ fontSize: 6 }}
                                sx={{
                                  color: "secondary.dark",
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

export default PaymentPackageList;
