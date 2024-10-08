import { Attendance } from "@/config/type/default/attendance";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { DrawerType, OpenType } from ".";
import { Box, Button, ButtonBase, TextField, Typography } from "@mui/material";
import moment from "moment";
import { CircleSharp, SearchSharp } from "@mui/icons-material";
import AlertModal from "../../Alert/Modal";
import db from "@/api/module";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

interface Props {
  row: Attendance;
  type: OpenType;
  setDrawerState: React.Dispatch<React.SetStateAction<DrawerType>>;
  getRows: () => void;
}

type Kind = "present" | "absent" | "late" | "excused";
type Method = {
  [key in Kind]: {
    label: string;
    color: string;
  };
};

const method: Method = {
  present: { label: "출석", color: "success.main" },
  late: { label: "지각", color: "warning.main" },
  excused: { label: "보강", color: "secondary.main" },
  absent: { label: "결석", color: "error.main" },
};

const AttendDetailDrawer = ({ row, type, getRows, setDrawerState }: Props) => {
  const [data, setData] = useState<Attendance>(row);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleSubmit = async () => {
    const { id = "", attendanceDate = "", status, excusedDate } = data;
    if (!attendanceDate) return toast.error("날짜를 설정해주세요!");

    if (status === "excused" && !excusedDate)
      return toast.error("보강 날짜를 선택해주세요");

    setLoading(true);

    try {
      const form = {
        id,
        attendanceDate: moment(attendanceDate).format("YYYY-MM-DD HH:mm:ss"),
        confirmationDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        method,
        status,
        dayOfWeek: moment(attendanceDate).format("d"),
        excusedDate: status === "excused" ? excusedDate : "",
      };

      await db.update("attendance", form);
      toast.success("정상적으로 처리 되었습니다.");
      handleClose();
      getRows();
      setDrawerState(DrawerType.none);
    } catch {
      toast.error("저장에 실패했습니다.");
    }
    setLoading(false);
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
            mb: 5,
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
            {row?.id ? "출석 이력 수정" : ""}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />{" "}
        </Box>

        <Box sx={{ height: "85%" }}>
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
              sx={{ width: "20%", fontSize: "14px" }}
            >
              출석일
            </Typography>
            <TextField
              id="schedule-end"
              type="datetime-local"
              fullWidth
              variant="outlined"
              defaultValue={
                data?.attendanceDate || moment().format("YYYY-MM-DD HH:mm:ss")
              }
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  attendanceDate: e.target.value,
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

          <Box sx={{ mt: 3, display: "flex", flexDirection: "row" }}>
            {Object.entries(method).map(([key, { label, color }]) => (
              <Button
                fullWidth
                size="medium"
                variant="outlined"
                sx={{
                  minWidth: "80px",
                  pl: 1,
                  pr: 1,
                  mr: 1,
                  borderRadius: 4,
                  color: data?.status === key ? color : "text.disabled",
                  borderColor: data?.status === key ? color : "text.disabled",
                  borderWidth: 2,
                }}
                onClick={() => {
                  setData((prev) => ({
                    ...prev,
                    status: key as Kind,
                    excusedDate: "",
                  }));
                }}
              >
                <CircleSharp
                  style={{ fontSize: 6 }}
                  sx={{
                    color: data?.status === key ? color : "text.disabled",
                    mr: 1,
                  }}
                />
                {label}
              </Button>
            ))}
          </Box>

          {data?.status === "excused" ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 6,
              }}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                mr={2}
                sx={{ width: "20%", fontSize: "14px" }}
              >
                보강날짜
              </Typography>
              <TextField
                id="schedule-end"
                type="date"
                fullWidth
                variant="outlined"
                defaultValue={
                  data?.excusedDate || moment().format("YYYY-MM-DD")
                }
                onChange={(e) => {
                  setData((prev) => ({
                    ...prev,
                    excusedDate: e.target.value,
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
          ) : null}
        </Box>
        <Box sx={{ height: "10%" }}>
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
              disabled={loading}
              sx={{
                background: (theme) => theme.palette.background.default,
                height: "40px",
                width: "40%",
              }}
              onClick={() => {
                setDrawerState(DrawerType.none);
              }}
            >
              <Box style={{ width: "100%", justifyContent: "center" }}>
                <Typography variant="h5" color="text.primary" fontWeight="bold">
                  취소하기
                </Typography>
              </Box>
            </Button>
            <Button
              variant="contained"
              onClick={handleOpen}
              disabled={loading}
              sx={{
                background: (theme) => theme.palette.primary.main,
                height: "40px",
                width: "40%",
              }}
            >
              <Box style={{ width: "100%", justifyContent: "center" }}>
                <Typography variant="h5" fontWeight="bold">
                  저장하기
                </Typography>
              </Box>
            </Button>
          </Box>
        </Box>
      </Box>

      <AlertModal
        open={open}
        handleClose={handleClose}
        onClickCheck={() => handleSubmit()}
        title={`출석 이력정보 저장`}
        content={`선택한 정보를 수정하시겠습니까?`}
        processing={loading}
      >
        <Box sx={{ minWidth: 80, my: 2 }}></Box>
      </AlertModal>
    </>
  );
};

export default AttendDetailDrawer;
