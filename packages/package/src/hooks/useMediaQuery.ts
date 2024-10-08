import { useMediaQuery } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";

type BreakPoint = "sm" | "md" | "lg" | "xl";

export const useClientSize = (breakpoint: BreakPoint) => {
  const theme = useMemo(
    () =>
      createTheme({
        breakpoints: {
          values: {
            xs: 0,
            sm: 768,
            md: 1024,
            lg: 1280,
            xl: 1520,
          },
        },
      }),
    []
  );

  const screen = useMediaQuery(theme.breakpoints.down(breakpoint || "sm"));
  return screen;
};
