import { Day, Session } from "@/config/type/default/session";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import NameSearchAutocomplete from "./StudentAutoComplete";
// import NameSearchAutocomplete from "./StudentAutoComplete";

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

interface LessonProps {
  data: Day;
  setForm: React.Dispatch<React.SetStateAction<Session>>;
  form: Session;
}

interface Props {
  form: Session;
  setForm: React.Dispatch<React.SetStateAction<Session>>;
}

const LessonTimeArray = ({ data, setForm, form }: LessonProps) => {
  const lessonTimes = form?.lessonTimes || {};
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
                lessonTimes: {
                  ...prev?.lessonTimes,
                  [data]: {
                    ...prev?.lessonTimes?.[data as Day],
                    stime: e.target.value as string,
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
                lessonTimes: {
                  ...prev?.lessonTimes,
                  [data]: {
                    ...prev?.lessonTimes?.[data as Day],
                    etime: e.target.value as string,
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

const SessionForm = ({ form, setForm }: Props) => {
  const [selectedWeeks, setSelectedWeeks] = useState<Day[]>([]);
  useEffect(() => {
    setSelectedWeeks(form?.regularDays as Day[]);
  }, [form]);

  const memoizedLessonTimeArrays = useMemo(() => {
    if (!selectedWeeks) return;
    return selectedWeeks.map((data) => (
      <LessonTimeArray key={data} data={data} form={form} setForm={setForm} />
    ));
  }, [selectedWeeks, form, setForm]);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Typography variant="subtitle1" sx={{ mb: 5 }}>
          {form?.id ? "세션 수정" : "세션 등록"}
        </Typography>
        <NameSearchAutocomplete
          form={form}
          setForm={setForm}
          multiple={false}
        />
      </Box>
      <Box sx={{ width: "100%", mb: 4, mt: 3 }}>
        <FormControl fullWidth variant="standard">
          <InputLabel sx={{ fontSize: "14px" }}>반복일 선택</InputLabel>
          <Select
            multiple
            displayEmpty
            name="regularDays"
            label="반복일 선택"
            value={form.regularDays}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                regularDays: e.target.value as Day[],
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
    </>
  );
};

export default SessionForm;
