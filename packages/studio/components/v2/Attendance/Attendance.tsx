import { Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import db from "@/api/module";
import moment from "moment";
import { RegularPayment, Student } from "@/config/type/default/students";
import AttendanceFilter from "./lib/AttendanceFilter";
import { useRecoilState } from "recoil";
import AttendanceDataAtom from "./lib/state";
import AttendanceCheck from "./lib/AttendanceCheck";
import { AttendStatus, type Rows } from "./lib";
import { Session } from "@/config/type/default/session";
import { useClientSize } from "package/src/hooks/useMediaQuery";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Attendance = () => {
  const [rows, setRows] = useState<Rows[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useClientSize("sm");

  const [dateState, setDateState] = useRecoilState(AttendanceDataAtom);

  const isPaymentValid = (regularPayment: RegularPayment): boolean => {
    const { lastPaymentDate, nextDueDate } = regularPayment;
    if (!lastPaymentDate || !nextDueDate) return false;

    const todayDate = moment(dateState.attendanceDate as string).format(
      "YYYY-MM-DD"
    );
    const lastPayment = moment(lastPaymentDate).format("YYYY-MM-DD");
    const nextDue = moment(nextDueDate).format("YYYY-MM-DD");

    return todayDate >= lastPayment && todayDate <= nextDue;
  };

  const onLoadData = useCallback(async () => {
    // setLoading(true);
    const day = moment(dateState.attendanceDate as string).format("d");
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
      options: {
        "sessionId.or": todaySession,
        "currentStatus.equal": true,
        "enrollmentDate.lte": moment(dateState.attendanceDate).format(
          "YYYY-MM-DD"
        ),
      },
    });

    await delay(300);

    const regularIds = studentItems
      .filter(({ paymentType = "" }) => paymentType === "regular")
      .map(({ id = "" }) => id);

    const { data: payments } = await db.search("payment", {
      options: {
        "studentId.or": regularIds,
        "paymentYearMonth.equal": moment(dateState.attendanceDate).format(
          "YYYY-MM"
        ),
      },
    });
    const paymentsInfoIds = payments.map(({ studentId = "" }) => studentId);

    const { data: attendance } = await db.search("attendance", {
      options: {
        "attendanceDate.like": moment(
          dateState.attendanceDate as string
        ).format("YYYY-MM-DD"),
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
            if (paymentsInfoIds.includes(id)) rowStatus = "standby";
            else if (!isPaymentValid(regularPayment)) rowStatus = "needCharge";
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
  }, [dateState]);

  useEffect(() => {
    onLoadData();
  }, [onLoadData]);

  useEffect(() => {
    return () => {
      setDateState({ attendanceDate: moment().format("YYYY-MM-DD") });
    };
  }, []);
  return (
    <>
      <Box sx={{ height: isMobile ? "1%" : "5%", background: "", pt: 1 }}>
        <AttendanceFilter />
      </Box>
      <Box sx={{ height: "95%", background: "" }}>
        <AttendanceCheck rows={rows} loading={loading} load={onLoadData} />
      </Box>
    </>
  );
};

export default Attendance;
