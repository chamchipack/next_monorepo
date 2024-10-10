import { Student } from "@/config/type/default/students";
import CloseIcon from "@mui/icons-material/Close";
import { DrawerType, OpenType } from "../hooks";
import React, { useEffect, useRef, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
  TextField,
  ButtonBase,
  FormControl,
  InputLabel,
} from "@mui/material";
import StudentForm from "./StudentForm";
import SessionForm from "./SessionForm";
import AntSwitch from "package/src/Interactive/AntSwitch";
import { Assemble, SessionSubmit, StudentSubmit, SubmitForm } from ".";
import moment from "moment";

import db from "@/api/module";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import AlertModal from "../../Alert/Modal";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface SearchResponse {
  status: number;
  data: any;
  message: string;
}
enum Status {
  success = "success",
  failed = "failed",
}

const steps = ["인원 정보", "세션 정보"];

interface Props {
  row: Student;
  type: OpenType;
  setDrawerState: React.Dispatch<React.SetStateAction<DrawerType>>;
  getRows: () => void;
}

const Form = ({ row, setDrawerState, type, getRows }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [classDivision, setClassDivision] = useState(true);
  const [submitdata, setSubmitdata] = useState<Assemble>({
    student: {},
    session: {},
  });
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleNext = () =>
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const onSetupSessionData = async (
    session: SessionSubmit,
    dataset: { classID: string[]; name: string }
  ): Promise<string> => {
    const { regularDays, lessonTimes } = session;

    const sessionData = {
      name: dataset.name,
      classId: dataset.classID ?? [],
      type: classDivision ? "lesson" : "class",
      instructorId: [],
      regularDays,
      lessonTimes,
      flexibleSchedule: [],
    };
    if (session?.id) Object.assign(sessionData, { id: session?.id });

    let result: SearchResponse;

    if (!sessionData?.name || !sessionData.regularDays?.length) {
      toast.error("빈칸을 작성해주세요!");
      return Status.failed as string;
    }

    try {
      if (session?.id) result = await db.update("session", sessionData);
      else result = await db.create("session", sessionData);

      return session?.id || result?.data?.id;
    } catch {
      return Status.failed as string;
    }
  };

  const onSetupStudentData = async (
    student: StudentSubmit,
    sessionId: string
  ) => {
    const {
      paymentType = "",
      lastPaymentDate = moment().format("YYYY-MM-DD"),
      total,
      remaining = 0,
      enrollmentDate = moment().format("YYYY-MM-DD"),
      sessionId: sId = "",
      ...rest
    } = student;

    const data = {
      enrollmentDate: moment(enrollmentDate).format("YYYY-MM-DD"),
      instructorId: [],
      type: classDivision ? "lesson" : "class",
      sessionId: [sessionId || sId],
      paymentType,
      ...rest,
    };
    if (student?.id) Object.assign(data, { id: student?.id });

    if (!student?.id) Object.assign(data, { currentStatus: true });

    if (paymentType === "regular") {
      Object.assign(data, {
        lessonBasedPayment: {},
        regularPayment: {
          lastPaymentDate,
          nextDueDate: lastPaymentDate
            ? moment(lastPaymentDate).add(1, "months").format("YYYY-MM-DD")
            : "",
        },
      });
    } else {
      Object.assign(data, {
        lessonBasedPayment: {
          isPaid: remaining < 1 ? false : true,
          total,
          over: 0,
          remaining: remaining || 0,
        },
        regularPayment: {},
      });
    }

    let result: SearchResponse;

    try {
      if (student?.id) result = await db.update("student", data);
      else result = await db.create("student", data);

      return type === "create" ? result?.data?.id : student?.id;
    } catch {
      return Status.failed as string;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const { student = {}, session = {} } = submitdata;

    if (!student?.paymentType) {
      toast.error("빈칸을 채워주세요!");
      setLoading(false);
      return;
    }

    if (student.paymentType === "package" && !student.total) {
      toast.error("빈칸을 채워주세요!");
      setLoading(false);
      return;
    }

    const dataset: { classID: string[]; name: string } = {
      classID: student?.classId ?? [],
      name: student?.name || "",
    };
    const sessionId = await onSetupSessionData(session, dataset);

    if (sessionId === Status.failed) return toast.error("저장에 실패했습니다");
    const studentId = await onSetupStudentData(student, sessionId);

    if (student?.id && session?.id) {
      getRows();
      toast.success("성공적으로 저장되었습니다");
      setDrawerState(DrawerType.none);
      setLoading(false);
      return;
    }
    await delay(1000);

    try {
      await db.update("session", { id: sessionId, studentId: [studentId] });

      toast.success("성공적으로 저장되었습니다");
      await delay(500);
      getRows();
    } catch {
      toast.error("저장에 실패했습니다.");
    }

    setDrawerState(DrawerType.none);
    setLoading(false);
  };

  const getSessionRow = async (id: string): Promise<SessionSubmit> => {
    try {
      const { data = {} } = await db.single("session", id);
      return data;
    } catch (e) {
      return {};
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const sessionRow = await getSessionRow(row.sessionId[0] || "");
      setSubmitdata((prev) => ({
        ...prev,
        student: {
          id: row.id || "",
          name: row.name || "",
          classId: row.classId ?? [],
          paymentType: row.paymentType,
          lastPaymentDate: row.regularPayment.lastPaymentDate,
          total: row.lessonBasedPayment.total,
          remaining: row.lessonBasedPayment.remaining,
          enrollmentDate: row.enrollmentDate,
          instructorId: row.instructorId ?? [],
          type: row.type,
          sessionId: row.sessionId ?? [],
          currentStatus: row.currentStatus,
        },
      }));
      if (sessionRow.id) {
        setSubmitdata((prev) => ({
          ...prev,
          session: {
            id: sessionRow.id,
            classId: sessionRow.classId ?? "",
            instructorId: sessionRow.instructorId,
            name: sessionRow.name,
            studentId: sessionRow.studentId,
            type: sessionRow.type,
            regularDays: sessionRow.regularDays,
            regularTimes: sessionRow.regularTimes,
            lessonTimes: sessionRow.lessonTimes,
          },
        }));
      }
    };

    if (row.id) fetchData();
  }, []);

  const handleExternalSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }
  };

  return (
    <>
      <Box sx={{ width: "100%", p: 3, height: "90%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "5%",
          }}
        >
          <ButtonBase
            onClick={() => {
              setDrawerState(DrawerType.none);
            }}
          >
            <CloseIcon sx={{ flexShrink: 0, fontSize: "20px" }} />
          </ButtonBase>
          <Typography
            variant="subtitle1"
            sx={{
              color: "text.primary",
              textAlign: "center",
              flexGrow: 1,
              width: "100%",
            }}
          >
            {row?.id ? "인원 및 세션 수정" : "인원 및 세션 등록"}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />{" "}
        </Box>
        <Box
          sx={{
            mt: 2,
            borderBottom: (theme) => `3px solid ${theme.palette.grey[100]}`,
            height: "5%",
          }}
        >
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color:
                        index !== activeStep ? "text.disabled" : "text.primary",
                    }}
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box sx={{ mt: 4, height: "80%" }}>
          <Box
            component="form"
            onSubmit={handleOpen}
            ref={formRef}
            sx={{ p: 1, width: "100%" }}
          >
            {!activeStep && (
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: classDivision ? "text.disabled" : "text.primary",
                  }}
                >
                  일반 수업
                </Typography>
                <AntSwitch
                  trackColor="info.main"
                  disabled
                  checked={classDivision}
                  onClick={() => {
                    setClassDivision(!classDivision);
                  }}
                  sx={{ mx: 2 }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: classDivision ? "text.primary" : "text.disabled",
                  }}
                >
                  개인 레슨
                </Typography>
              </Box>
            )}
            <StudentForm
              hidden={activeStep !== 0}
              row={row}
              division={classDivision}
              form={submitdata}
              setForm={setSubmitdata}
            />
            <SessionForm
              hidden={activeStep !== 1}
              row={row}
              division={classDivision}
              form={submitdata}
              setForm={setSubmitdata}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            pt: 2,
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            sx={{
              background: (theme) => theme.palette.background.default,
              height: "40px",
              width: "40%",
            }}
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
          >
            <Box style={{ width: "100%", justifyContent: "center" }}>
              <Typography variant="h5" color="text.primary" fontWeight="bold">
                이전
              </Typography>
            </Box>
          </Button>
          <Button
            onClick={
              activeStep === steps.length - 1
                ? handleExternalSubmit
                : handleNext
            }
            disabled={loading}
            // type={activeStep === 1 ? "submit" : "button"}
            variant="contained"
            sx={{
              background: (theme) =>
                activeStep === steps.length - 1
                  ? theme.palette.success.main
                  : theme.palette.primary.main,
              height: "40px",
              width: "40%",
            }}
          >
            <Box style={{ width: "100%", justifyContent: "center" }}>
              <Typography variant="h5" fontWeight="bold">
                {activeStep === steps.length - 1 ? "저장" : "다음"}
              </Typography>
            </Box>
          </Button>
        </Box>
      </Box>

      <AlertModal
        open={open}
        handleClose={handleClose}
        onClickCheck={() => handleSubmit()}
        title={`수강생 정보 저장`}
        content={`선택한 정보를 저장하시겠습니까?`}
        processing={loading}
      >
        <Box sx={{ minWidth: 80, my: 2 }}></Box>
      </AlertModal>
    </>
  );
};

export default Form;
