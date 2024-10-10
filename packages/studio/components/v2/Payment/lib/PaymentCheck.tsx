import { Box, Button, Skeleton, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddCardIcon from "@mui/icons-material/AddCard";
import Regular from "./Regular";
import Package from "./Package";

import db from "@/api/module";
import { useRecoilState } from "recoil";
import PaymentDataAtom from "./state";
import moment from "moment";
import { RegularPayment, Student } from "@/config/type/default/students";
import { PaymentStatus, Rows } from ".";
import { Class } from "@/config/type/default/class";
import { useClassData } from "../hooks/hook";

interface Props {}

type ClassData = {
  [key: string]: { name: string; price: number };
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PaymentCheck = ({}: Props) => {
  const [rows, setRows] = useState<Rows[]>([]);
  const [classData, setClassData] = useState<ClassData>({});
  const [loading, setLoading] = useState(false);

  const [dateState, setDateState] = useRecoilState(PaymentDataAtom);
  const [toggle, setToggle] = useState<string>("regular");

  const isPaymentValid = (regularPayment: RegularPayment): boolean => {
    const { lastPaymentDate, nextDueDate } = regularPayment;
    if (!lastPaymentDate || !nextDueDate) return false;

    const todayDate = moment(dateState as string).format("YYYY-MM-DD");
    const lastPayment = moment(lastPaymentDate).format("YYYY-MM-DD");
    const nextDue = moment(nextDueDate).format("YYYY-MM-DD");

    return todayDate >= lastPayment && todayDate <= nextDue;
  };

  const {
    data: classDataResponse = { rows: [], total: 0 },
    isLoading: isClassDataLoading,
    refetch: refetchClassData,
  } = useClassData("class");

  const formSet = (rows: Class[]) => {
    const result = rows.reduce((acc: ClassData, item: Class) => {
      acc = {
        ...acc,
        [item?.id as string]: { name: item.name, price: item.price },
      };
      return acc;
    }, {});
    return result;
  };
  const classSet = formSet(classDataResponse.rows);

  // const onLoadClassData = useCallback(async (): Promise<ClassData> => {
  //   const { data: items } = await db.search("class", { options: {} });
  //   const result = items.reduce((acc: ClassData, item: Class) => {
  //     acc = {
  //       ...acc,
  //       [item?.id as string]: { name: item.name, price: item.price },
  //     };
  //     return acc;
  //   }, {});
  //   setClassData(result);
  //   return result;
  // }, []);

  const onLoadPackageData = useCallback(async () => {
    setLoading(true);

    let _classData = classSet;

    if (!Object.entries(classSet).length) {
      const { data: { rows: _rows = [] } = {} } = await refetchClassData();
      _classData = formSet(_rows as Class[]);
    }

    // if (!Object.entries(classData).length) _classData = await onLoadClassData();

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

    const result: Rows[] = studentItems.map((data: Student) => ({
      ...data,
      rowStatus: "needCharge",
      price:
        classArray.find(({ id: cid }) => data?.classId.includes(cid))?.price ||
        0,
    }));

    setRows(result);
    setLoading(false);
  }, [dateState]);

  const onLoadRegularData = useCallback(async () => {
    setLoading(true);
    try {
      let _classData = classSet;
      if (!Object.entries(classSet).length) {
        const { data: { rows: _rows = [] } = {} } = await refetchClassData();
        _classData = formSet(_rows as Class[]);
      }

      const { data: paymentItems } = await db.search("payment", {
        options: {
          "paymentYearMonth.like": moment(
            dateState.paymentDate as string
          ).format("YYYY-MM"),
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
          "enrollmentDate.lte": moment(dateState.paymentDate)
            .add(1, "month")
            .format("YYYY-MM-DD"),
        },
      });

      const result: Rows[] = studentItems.reduce(
        (acc: Rows[], data: Student) => {
          const { id = "", classId = [] } = data;

          let rowStatus: PaymentStatus = "completed";

          if (paymentObject[id]) rowStatus = "completed";
          else rowStatus = "needCharge";

          acc.push({
            ...data,
            classId,
            price:
              classArray.find(({ id: cid }) => classId.includes(cid))?.price ||
              0,
            rowStatus,
          });
          return acc;
        },
        []
      );

      setRows(result);
    } catch {}

    setLoading(false);
  }, [dateState]);

  useEffect(() => {
    if (toggle === "regular") onLoadRegularData();
    else onLoadPackageData();
  }, [onLoadRegularData, onLoadPackageData, toggle, dateState]);

  return (
    <>
      <Box
        sx={{
          mt: 1,
          borderRadius: 2,
          height: "100%",
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            height: "100%",
          }}
        >
          <Box sx={{ height: "100%" }}>
            {/* <Box sx={{ mb: 2 }}>
                <Typography
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  결제 대상자
                </Typography>
              </Box> */}

            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Box>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => {
                    setToggle("regular");
                  }}
                  sx={{
                    pl: 1,
                    pr: 1,
                    mr: 0.5,
                    mb: 1,
                    borderRadius: 4,
                    border: (theme) => `1.5px solid ${theme.palette.grey[100]}`,
                    borderColor:
                      toggle === "regular" ? "primary.dark" : "text.disabled",
                    color:
                      toggle === "regular" ? "primary.dark" : "text.disabled",
                  }}
                >
                  <AssignmentIcon
                    style={{ fontSize: 16 }}
                    sx={{ mr: 1 }}
                    color="success"
                  />
                  정기결제
                </Button>
              </Box>
              <Box>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => {
                    setToggle("package");
                  }}
                  sx={{
                    pl: 1,
                    pr: 1,
                    mr: 0.5,
                    mb: 1,
                    borderRadius: 4,
                    border: (theme) => `1.5px solid ${theme.palette.grey[100]}`,
                    borderColor:
                      toggle === "package" ? "secondary.dark" : "text.disabled",
                    color:
                      toggle === "package" ? "secondary.dark" : "text.disabled",
                  }}
                >
                  <AddCardIcon
                    style={{ fontSize: 16 }}
                    sx={{ mr: 1 }}
                    color="info"
                  />
                  회차결제
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                // overflowY: "auto",
                // maxHeight: "70vh",
                mt: 0,
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
                        mt: 1,
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
                <Box sx={{ height: "100%" }}>
                  {toggle === "regular" ? (
                    <Box sx={{}}>
                      <Regular rows={rows} getRows={onLoadRegularData} />
                    </Box>
                  ) : (
                    <Package rows={rows} getRows={onLoadPackageData} />
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PaymentCheck;
