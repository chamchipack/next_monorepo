import React, { memo } from "react";
import { Box, Button } from "@mui/material";
import { CircleSharp } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import ToggleButtonStateAtom from "./state";

enum Toggle {
  entire = "entire",
  class = "class",
  type = "type",
  method = "method",
}

const ToggleButtons = memo(() => {
  const [toggleState, setToggleState] = useRecoilState(ToggleButtonStateAtom);
  return (
    <Box
      sx={{
        width: "40%",
        height: "90%",
        display: "flex",
        py: 2,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Button
        size="medium"
        variant="outlined"
        sx={{
          width: 100,
          color: toggleState === Toggle.entire ? "info.main" : "text.disabled",
          pl: 1,
          pr: 1,
          borderRadius: 4,
          border: (theme) =>
            `2px solid ${toggleState === Toggle.entire ? theme.palette.info.main : theme.palette.text.disabled}`,
        }}
        onClick={() => setToggleState(Toggle.entire)}
      >
        <CircleSharp
          style={{ fontSize: 6 }}
          sx={{
            color: "info.main",
            mr: 1,
          }}
        />
        전체금액
      </Button>

      <Button
        size="medium"
        variant="outlined"
        sx={{
          width: 100,
          color: toggleState === Toggle.type ? "info.main" : "text.disabled",
          pl: 1,
          pr: 1,
          borderRadius: 4,
          border: (theme) =>
            `2px solid ${toggleState === Toggle.type ? theme.palette.info.main : theme.palette.text.disabled}`,
        }}
        onClick={() => setToggleState(Toggle.type)}
      >
        <CircleSharp
          style={{ fontSize: 6 }}
          sx={{
            color: "info.main",
            mr: 1,
          }}
        />
        결제타입별
      </Button>

      <Button
        size="medium"
        variant="outlined"
        sx={{
          width: 100,
          color: toggleState === Toggle.method ? "info.main" : "text.disabled",
          pl: 1,
          pr: 1,
          borderRadius: 4,
          border: (theme) =>
            `2px solid ${toggleState === Toggle.method ? theme.palette.info.main : theme.palette.text.disabled}`,
        }}
        onClick={() => setToggleState(Toggle.method)}
      >
        <CircleSharp
          style={{ fontSize: 6 }}
          sx={{
            color: "info.main",
            mr: 1,
          }}
        />
        결제방법별
      </Button>
    </Box>
  );
});

export default ToggleButtons;
