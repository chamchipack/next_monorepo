import { Class } from "@/config/type/default/class";
import {
  Box,
  Button,
  ButtonBase,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { DrawerType, OpenType } from "..";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import AlertModal from "../../Alert/Modal";
import db from "@/api/module";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

interface Props {
  row: Class;
  type: OpenType;
  setDrawerState: React.Dispatch<React.SetStateAction<DrawerType>>;
  getRows: () => void;
}

const ClassForm = ({ row, type, getRows, setDrawerState }: Props) => {
  const [data, setData] = useState<Class>(row);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleSubmit = async () => {
    const { id = "", name = "", price = 0 } = data;
    if (!name) return toast.error("날짜를 설정해주세요!");

    setLoading(true);

    try {
      const form = {
        id,
        name,
        price,
      };
      if (id) await db.update("class", form);
      else await db.create("class", form);

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
            {row?.id ? "과목 정보 수정" : "과목 등록"}
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
              my: 6,
            }}
          >
            <Box
              sx={{
                width: "25%",
              }}
            >
              <Typography variant="body1" fontWeight="bold" fontSize="14px">
                과목명
              </Typography>
            </Box>
            <TextField
              defaultValue={data?.name}
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  name: e.target.value,
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
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              my: 6,
            }}
          >
            <Box
              sx={{
                width: "25%",
              }}
            >
              <Typography variant="body1" fontWeight="bold" fontSize="14px">
                결제액
              </Typography>
            </Box>
            <Slider
              aria-label="Custom marks"
              sx={{ color: "info.main" }}
              defaultValue={data?.price || 0}
              step={10000}
              marks
              min={50000}
              max={200000}
              valueLabelDisplay="on"
              onChange={(e, value) => {
                setData((prev) => ({
                  ...prev,
                  price: value as number,
                }));
              }}
            />
          </Box>
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
        title={`과목정보 저장`}
        content={`선택한 정보를 저장하시겠습니까?`}
        processing={loading}
      ></AlertModal>
    </>
  );
};

export default ClassForm;
