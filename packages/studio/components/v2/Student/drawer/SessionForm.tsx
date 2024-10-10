import { Student } from "@/config/type/default/students";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Box, alpha } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import { Assemble } from ".";
import { Day } from "@/config/type/default/session";

type Week = { text: string; value: string };
const weeks: Week[] = [
  { text: "일", value: "0" },
  { text: "월", value: "1" },
  { text: "화", value: "2" },
  { text: "수", value: "3" },
  { text: "목", value: "4" },
  { text: "금", value: "5" },
  { text: "토", value: "6" },
];

interface Props {
  hidden: boolean;
  row: Student;
  division: boolean;
  setForm: React.Dispatch<React.SetStateAction<Assemble>>;
  form: Assemble;
}

interface LessonProps {
  data: Day;
  setForm: React.Dispatch<React.SetStateAction<Assemble>>;
  form: Assemble;
}

const LessonTimeArray = ({ data, setForm, form }: LessonProps) => {
  const lessonTimes = form?.session?.lessonTimes || {};
  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          marginBottom: 2,
          p: 2,
          borderRadius: 4,
          background: (theme) => alpha(theme.palette.grey[100], 0.5),
        }}
      >
        <Typography variant="subtitle2" sx={{ color: "info.main" }}>
          {`${weeks.find(({ value = "" }) => data === value)?.text}요일`}{" "}
          <Typography
            variant="caption"
            component="span"
            sx={{ color: "text.secondary" }}
          >
            시간 선택
          </Typography>
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 1,
            mt: 1,
          }}
        >
          <Typography
            variant="body1"
            fontWeight="bold"
            sx={{ fontSize: "14px", minWidth: "80px" }}
          >
            시작시간
          </Typography>
          <TextField
            type="time"
            variant="outlined"
            inputProps={{
              step: 600,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            defaultValue={lessonTimes[data]?.stime}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                session: {
                  ...prev.session,
                  lessonTimes: {
                    ...prev.session?.lessonTimes,
                    [data]: {
                      ...prev.session?.lessonTimes?.[data as Day],
                      stime: e.target.value as string,
                    },
                  },
                },
              }));
            }}
            sx={{
              width: "calc(100% - 100px)",
              "& .MuiOutlinedInput-root": {
                height: "30px",
                "& input": {
                  height: "40px",
                  padding: "0 14px",
                },
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 1,
          }}
        >
          <Typography
            variant="body1"
            fontWeight="bold"
            sx={{ fontSize: "14px", minWidth: "80px" }}
          >
            종료시간
          </Typography>
          <TextField
            type="time"
            name={`etime${data}`}
            variant="outlined"
            inputProps={{
              step: 600, // 10분 단위 (600초)
            }}
            InputLabelProps={{
              shrink: true,
            }}
            defaultValue={lessonTimes[data]?.etime}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                session: {
                  ...prev.session,
                  lessonTimes: {
                    ...prev.session?.lessonTimes,
                    [data]: {
                      ...prev.session?.lessonTimes?.[data as Day],
                      etime: e.target.value as string,
                    },
                  },
                },
              }));
            }}
            sx={{
              width: "calc(100% - 100px)",
              "& .MuiOutlinedInput-root": {
                height: "30px",
                "& input": {
                  height: "40px",
                  padding: "0 14px",
                },
              },
            }}
          />
        </Box>
      </Box>
    </>
  );
};

const SessionForm = ({ hidden, row, setForm, form }: Props) => {
  const [selectedWeeks, setSelectedWeeks] = useState<Day[]>([]);
  useEffect(() => {
    setSelectedWeeks(form?.session?.regularDays as Day[]);
  }, [form]);

  const memoizedLessonTimeArrays = useMemo(() => {
    if (!selectedWeeks) return;
    return selectedWeeks.map((data) => (
      <LessonTimeArray key={data} data={data} form={form} setForm={setForm} />
    ));
  }, [selectedWeeks, form, setForm]);

  return (
    <Box sx={{ display: hidden ? "none" : "block" }}>
      {/* <TextField
        autoFocus
        margin="dense"
        label="세션명"
        type="text"
        fullWidth
        sx={{ mb: 3 }}
        variant="standard"
        defaultValue={form?.session?.name}
        onChange={(e) => {
          setForm((prev) => ({
            ...prev,
            session: {
              ...prev.session,
              name: e.target.value,
            },
          }));
        }}
        InputLabelProps={{
          sx: {
            fontSize: "14px", // 원하는 글씨 크기
          },
        }}
      /> */}

      <Box sx={{ width: "100%", marginBottom: 4 }}>
        <FormControl fullWidth variant="standard">
          <InputLabel sx={{ fontSize: "14px" }}>반복일 선택</InputLabel>
          <Select
            multiple
            displayEmpty
            name="regularDays"
            label="반복일 선택"
            value={form?.session?.regularDays || []}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                session: {
                  ...prev.session,
                  regularDays: e.target.value as string[],
                },
              }));
            }}
          >
            {weeks.map(({ value = "", text = "" }) => (
              <MenuItem key={value} value={value}>
                {text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {memoizedLessonTimeArrays}
    </Box>
  );
};

export default SessionForm;
