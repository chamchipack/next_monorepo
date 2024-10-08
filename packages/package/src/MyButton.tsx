import { Button, Typography } from "@mui/material";
import "../styles/styles.css";
import {
  kboFont,
  pretendardFont,
  nanumFont,
  tmoneyFont,
} from "package/styles/fonts/module";

export const MyButton = () => {
  return (
    <>
      <Button>안녕하세요</Button>
      <Typography sx={{}}>뭐지이거</Typography>
      <Typography sx={{ ...kboFont }}>크보</Typography>
      <Typography sx={{ ...pretendardFont }}>프리텐다드</Typography>
      <Typography sx={{ ...nanumFont }}>나눔폰트</Typography>
      <Typography sx={{ ...tmoneyFont }}>티머니폰트</Typography>

      <div>뭐지이거</div>
      <div style={{ ...kboFont }}>기본</div>
      <div style={{ ...pretendardFont }}>기본</div>
      <div style={{ ...nanumFont }}>기본</div>
      <div style={{ ...tmoneyFont }}>안녕하세요 국민여러분</div>
    </>
  );
};
