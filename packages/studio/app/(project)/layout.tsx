"use client";

import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { DemoThemeData } from "@/config/utils/Theme";
import { useMemo } from "react";

const DemoThemeProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const theme = useMemo(() => createTheme(DemoThemeData), [DemoThemeData]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <DemoThemeProvider>
        <main>{children}</main>
      </DemoThemeProvider>
    </>
  );
};

export default Layout;
