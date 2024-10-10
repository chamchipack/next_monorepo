import { Switch, styled } from "@mui/material";
import { Theme } from "@mui/material/styles";

const AntSwitch = styled(Switch, {
  shouldForwardProp: (prop) => prop !== "trackColor",
})<{ trackColor: string }>(({ theme, trackColor }) => {
  const colorParts = trackColor.split(".");
  const color =
    colorParts.length === 2
      ? (theme.palette[colorParts[0] as keyof Theme["palette"]] as any)[
          colorParts[1]
        ]
      : theme.palette[trackColor as keyof Theme["palette"]];

  return {
    width: 40,
    height: 20,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 15,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(9px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(20px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "primary.main",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 16,
      height: 16,
      borderRadius: 14,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
    },
    "& .MuiSwitch-track": {
      borderRadius: 20 / 2,
      opacity: 1,
      backgroundColor: color ? color : theme.palette.text.disabled,
      boxSizing: "border-box",
    },
  };
});

export default AntSwitch;
