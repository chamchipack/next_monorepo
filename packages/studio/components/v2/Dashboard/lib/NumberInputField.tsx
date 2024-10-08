import React from "react";
import { TextField } from "@mui/material";

interface Props {
  standard: number;
  setStandard: React.Dispatch<React.SetStateAction<number>>;
}
const NumberInputField = ({ standard, setStandard }: Props) => {
  return (
    <TextField
      type="number"
      variant="outlined"
      defaultValue={standard}
      InputProps={{
        sx: {
          width: "40px",
          height: "40px",
          padding: 0, // 여백 최소화
          "& input": {
            padding: 0, // 입력 영역의 여백을 최소화합니다.
            textAlign: "center", // 입력된 숫자를 가운데 정렬합니다.
            MozAppearance: "textfield", // Firefox에서 기본 스타일 유지
            "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
              WebkitAppearance: "inline-block", // 스핀 버튼 항상 보이도록 설정
              margin: 0,
            },
          },
          "& fieldset": {
            border: "none", // 테두리 제거
          },
        },
      }}
    />
  );
};

export default NumberInputField;
