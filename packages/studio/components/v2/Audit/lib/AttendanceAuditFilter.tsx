import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import AttendanceDataGridAtom from "./state";
import { CircleSharp, SearchSharp } from "@mui/icons-material";
import MethodFilter from "./MethodFilter";
import PaymentFilter from "./PaymentFilter";
import StatusFilter from "./StatusFilter";
import moment from "moment";
import { useClientSize } from "package/src/hooks/useMediaQuery";
import DateFilter from "./DateFilter";

const AttendanceAuditFilter = () => {
  const theme = useTheme();
  const searchKeywordRef = useRef<HTMLInputElement>(null);
  const [paymentState, setPaymentState] = useState({
    regular: false,
    package: false,
  });
  const isMobile = useClientSize("sm");

  const [dataGridAttendanceState, setDataGridAttendanceState] = useRecoilState(
    AttendanceDataGridAtom
  );
  const onClickPaymentFilter = useCallback(
    (key: "regular" | "package") => {
      const newStatus = { ...paymentState, [key]: !paymentState[key] };

      const result =
        newStatus.regular && !newStatus.package
          ? "regular"
          : !newStatus.regular && newStatus.package
            ? "package"
            : null;

      setPaymentState(newStatus);

      setDataGridAttendanceState({
        ...dataGridAttendanceState,
        "paymentType.equal": result,
      });
    },
    [paymentState, dataGridAttendanceState, setDataGridAttendanceState]
  );

  useEffect(() => {
    return () => {
      setDataGridAttendanceState({
        "attendanceDate.like": moment().format("YYYY-MM-DD"),
      });
    };
  }, []);

  const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ("Enter" === e.key) {
      e.preventDefault();
      setDataGridAttendanceState({
        ...dataGridAttendanceState,
        "studentName.like": searchKeywordRef.current?.value,
      });
    }
  };
  return (
    <>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "white",
        }}
        sx={{ my: 2 }}
      >
        <Grid style={{ height: "100%", display: "flex", alignItems: "center" }}>
          {/* <PaymentFilter /> */}
          {/* <FormControl fullWidth size="small">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mr: 2,
              }}
            >
              <TextField
                id="schedule-end"
                type="date"
                // defaultValue={moment().format("YYYY-MM-DD")}
                value={dataGridAttendanceState["attendanceDate.like"]}
                onChange={(e) =>
                  setDataGridAttendanceState({
                    ...dataGridAttendanceState,
                    "attendanceDate.like": e.target.value as string,
                  })
                }
                sx={{
                  borderColor: "#d2d2d2",
                  borderRadius: 1,
                  height: 40,
                }}
                InputProps={{
                  style: { height: 40 },
                }}
              />
            </Box>
          </FormControl> */}
          <DateFilter setDataGridAttendanceState={setDataGridAttendanceState} />
          {!isMobile && (
            <Box
              sx={{
                background: (theme) => theme.palette.background.default,
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button
                fullWidth
                size="medium"
                variant="outlined"
                sx={{
                  "&:hover": {
                    bgcolor: theme.palette.primary.main,
                    opacity: 0.8,
                  },
                  minWidth: "70px",
                  pl: 1,
                  pr: 1,
                  mr: 1,
                  borderRadius: 4,
                  color: "text.secondary",
                  borderColor: (theme) =>
                    paymentState.regular
                      ? theme.palette.primary.main
                      : theme.palette.grey[100],
                  background: (theme) =>
                    paymentState.regular
                      ? theme.palette.primary.main
                      : theme.palette.grey[100],
                }}
                onClick={() => {
                  onClickPaymentFilter("regular");
                }}
              >
                정기결제
              </Button>
              <Button
                fullWidth
                size="medium"
                variant="outlined"
                sx={{
                  "&:hover": {
                    bgcolor: theme.palette.primary.main,
                    opacity: 0.8,
                  },
                  minWidth: "70px",
                  pl: 1,
                  pr: 1,
                  mr: 1,
                  borderRadius: 4,
                  color: "text.secondary",
                  borderColor: (theme) =>
                    paymentState.package
                      ? theme.palette.primary.main
                      : theme.palette.grey[100],
                  background: (theme) =>
                    paymentState.package
                      ? theme.palette.primary.main
                      : theme.palette.grey[100],
                }}
                onClick={() => {
                  onClickPaymentFilter("package");
                }}
              >
                회차결제
              </Button>
            </Box>
          )}
          <StatusFilter />
        </Grid>
        {!isMobile && (
          <FormControl
            size="small"
            style={{ marginLeft: "auto", maxWidth: "300px" }}
          >
            <OutlinedInput
              id="search"
              inputRef={searchKeywordRef}
              placeholder="결제 수강생의 이름을 입력해주세요"
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
                    onClick={() =>
                      setDataGridAttendanceState({
                        ...dataGridAttendanceState,
                        "studentName.like": searchKeywordRef.current?.value,
                      })
                    }
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
        )}
      </Box>
    </>
  );
};

export default AttendanceAuditFilter;
