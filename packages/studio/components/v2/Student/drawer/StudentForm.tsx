import { Student } from "@/config/type/default/students";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { useEffect, useState } from "react";
import { Assemble } from ".";
import NameSearchAutocomplete from "./StudentAutoComplete";
import moment from "moment";

const Model = [
  {
    text: "정기결제",
    value: "regular",
    icon: ApartmentIcon,
    theme: "warning",
  },
];

const additional = {
  text: "회차결제",
  value: "package",
  icon: DirectionsCarIcon,
  theme: "info",
};

type Buttons = {
  text: string;
  value: string;
  icon: any;
  theme: string;
};

interface Props {
  hidden: boolean;
  row: Student;
  division: boolean;
  setForm: React.Dispatch<React.SetStateAction<Assemble>>;
  form: Assemble;
}

const StudentForm = ({ hidden, row, setForm, division, form }: Props) => {
  const theme = useTheme();

  const [category, setCategory] = useState<string>("");
  const [buttonForm, setButtonForm] = useState<Buttons[]>([]);

  useEffect(() => {
    if (!division) setButtonForm(Model);
    else setButtonForm([...Model, additional]);
    setCategory(form?.student?.paymentType || "");
  }, [division, form]);

  const onClickCategoryButton = async (item: string) => {
    const result = item === category ? "" : item;
    setCategory(result);
  };

  return (
    <Box sx={{ display: hidden ? "none" : "block" }}>
      <TextField
        autoFocus
        margin="dense"
        label="이름"
        type="text"
        fullWidth
        variant="standard"
        sx={{ mb: 3, mt: 3 }}
        defaultValue={form?.student?.name}
        onChange={(e) => {
          setForm((prev) => ({
            ...prev,
            student: {
              ...prev.student,
              name: e.target.value,
            },
          }));
        }}
        InputLabelProps={{
          sx: {
            fontSize: "14px", // 원하는 글씨 크기
          },
        }}
      />

      <NameSearchAutocomplete form={form} setForm={setForm} />

      <Box
        sx={{
          width: "100%",
          mt: 5,
          mb: 4,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {buttonForm.length &&
          buttonForm.map(({ value, text, icon: Icon, theme: _theme }) => {
            const paletteColor =
              theme.palette[_theme as keyof typeof theme.palette];
            const backgroundColor =
              paletteColor &&
              typeof paletteColor === "object" &&
              "main" in paletteColor
                ? paletteColor.main
                : theme.palette.primary.main;

            return (
              <Box key={value}>
                <Button
                  size="medium"
                  variant="outlined"
                  sx={{
                    pl: 1,
                    pr: 1,
                    "&:hover": {
                      bgcolor: theme.palette.primary.main,
                      opacity: 0.8,
                    },
                    borderColor:
                      category === value
                        ? theme.palette.primary.main
                        : theme.palette.grey["A100"],
                    color:
                      category === value
                        ? "primary.contrastText"
                        : theme.palette.text.secondary,
                    bgcolor:
                      category === value
                        ? theme.palette.primary.main
                        : theme.palette.grey["A100"],
                    borderRadius: 4,
                    mr: 0.5,
                    mb: 1,
                  }}
                  onClick={async () => {
                    onClickCategoryButton(value);
                    setForm((prev) => ({
                      ...prev,
                      student: {
                        ...prev.student,
                        paymentType: value as "regular" | "package",
                        lastPaymentDate: "",
                        total: 0,
                      },
                    }));
                  }}
                >
                  <Icon
                    sx={{
                      mr: 0.5,
                      fontSize: "12px",
                      color: theme.palette.background.default,
                      backgroundColor: backgroundColor,
                      borderRadius: 50,
                    }}
                  />{" "}
                  {text}
                </Button>
              </Box>
            );
          })}
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <Typography
          variant="body1"
          fontWeight="bold"
          mr={2}
          sx={{ width: "30%", fontSize: "14px" }}
        >
          등록 기준일
        </Typography>
        <TextField
          id="schedule-end"
          type="date"
          fullWidth
          variant="outlined"
          defaultValue={form?.student?.enrollmentDate || ""}
          onChange={(e) => {
            setForm((prev) => ({
              ...prev,
              student: {
                ...prev.student,
                enrollmentDate: e.target.value,
              },
            }));
          }}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            height: "40px",
            "& .MuiOutlinedInput-root": {
              height: "40px",
              "& input": {
                height: "40px",
                padding: "0 14px",
              },
            },
          }}
        />
      </Box>

      {category ? (
        <>
          {category === "package" ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "30%",
                    fontSize: "14px",
                  }}
                >
                  전체 횟수
                </Box>
                <Slider
                  aria-label="Custom marks"
                  sx={{ color: "info.main" }}
                  defaultValue={form?.student?.total || 1}
                  step={1}
                  marks
                  min={1}
                  max={10}
                  valueLabelDisplay="on"
                  onChange={(e, value) => {
                    setForm((prev) => ({
                      ...prev,
                      student: {
                        ...prev.student,
                        total: value as number,
                      },
                    }));
                  }}
                />
              </Box>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 4,
                }}
              >
                <Box
                  sx={{
                    width: "30%",
                    fontSize: "14px",
                  }}
                >
                  남은 횟수
                </Box>
                <Slider
                  aria-label="Custom marks"
                  sx={{ color: "info.main" }}
                  defaultValue={form?.student?.remaining || 0}
                  step={1}
                  marks
                  min={0}
                  max={form?.student?.total || 0}
                  valueLabelDisplay="on"
                  onChange={(e, value) => {
                    setForm((prev) => ({
                      ...prev,
                      student: {
                        ...prev.student,
                        remaining: value as number,
                      },
                    }));
                  }}
                />
              </Box>
            </>
          ) : null}
        </>
      ) : null}
    </Box>
  );
};

export default StudentForm;
