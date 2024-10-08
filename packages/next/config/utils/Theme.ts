import { Components } from "@mui/material/styles";
import { TypographyOptions } from "@mui/material/styles/createTypography";
import { Noto_Sans_KR } from "next/font/google";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--noto_sans_kr",
  weight: "600",
});

const typographyProperties: TypographyOptions = {
  fontSize: 14,
  h1: {
    fontWeight: 600,
    fontSize: 36,
    lineHeight: "39.6px",
    letterSpacing: "-0.015em",
  },
  h2: {
    fontWeight: 700,
    fontSize: 28,
    lineHeight: "32.2px",
    letterSpacing: "-0.005em",
  },
  h3: {
    fontWeight: 700,
    fontSize: 24,
    lineHeight: "28.08px",
  },
  h4: {
    fontWeight: 600,
    fontSize: 20,
    lineHeight: "24px",
    letterSpacing: "0.0025em",
  },
  h5: {
    fontWeight: 600,
    fontSize: 14,
    lineHeight: "17.92px",
    letterSpacing: "0.005em",
  },
  h6: {
    fontWeight: 500,
    fontSize: 12,
    lineHeight: "16px",
    letterSpacing: "0.015em",
  },
  subtitle1: {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: "20px",
    letterSpacing: "0.0015em",
  },
  subtitle2: {
    fontWeight: 600,
    fontSize: 14,
    lineHeight: "18.67px",
    letterSpacing: "0.001em",
  },
  body1: {
    fontWeight: 500,
    fontSize: 16,
    lineHeight: "22.4px",
    letterSpacing: "0.005em",
  },
  body2: {
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "19.6px",
    letterSpacing: "0.0025em",
  },
  caption: {
    fontWeight: 300,
    fontSize: 12,
    lineHeight: "16px",
    letterSpacing: "0.004em",
  },
  overline: {
    fontWeight: 400,
    fontSize: 10,
    lineHeight: "14px",
    letterSpacing: "0.015em",
  },
};

const buttonProperties: Components["MuiButton"] = {
  defaultProps: { size: "small" },
  styleOverrides: {
    sizeSmall: {
      fontWeight: 500,
      fontSize: 12,
      lineHeight: "16px",
      letterSpacing: "0.025em",
      padding: "2px 10px",
    },
    sizeMedium: {
      fontWeight: 600,
      fontSize: 13,
      lineHeight: "18px",
      letterSpacing: "0.025em",
      padding: "3px 15px",
    },
    sizeLarge: {
      fontWeight: 600,
      fontSize: 14,
      lineHeight: "20px",
      letterSpacing: "0.035em",
      padding: "4px 20px",
    },
    containedSecondary: ({ theme }: { theme: any }) => ({
      backgroundColor: theme.palette.grey.A200,
      color: theme.palette.getContrastText(theme.palette.grey.A200),
      ":hover": {
        backgroundColor: theme.palette.grey.A100,
        color: theme.palette.getContrastText(theme.palette.grey.A100),
      },
    }),
    textSecondary: ({ theme }: { theme: any }) => ({
      color: theme.palette.text.secondary,
      ":hover": {
        color: theme.palette.primary.main,
        textDecoration: "underline",
      },
    }),
  },
};

export const DemoThemeData = {
  components: {
    MuiButton: buttonProperties,
  },
  typography: {
    fontFamily: notoSansKR.style.fontFamily,
    ...typographyProperties,
  },
  palette: {
    common: {
      black: "#222222",
      white: "#F8F8F8",
    },
    primary: {
      light: "#D6EEEE80",
      main: "#83CBCB",
      dark: "#30A7A7",
      contrastText: "#FFFFFF",
    },
    secondary: {
      light: "#EDF1FBB2",
      main: "#B5C9EF",
      dark: "#6B92DE",
      contrastText: "#FFFFFF",
    },
    error: {
      light: "#F9C0C780",
      main: "#F16979",
      dark: "#C91A2E",
      contrastText: "#FFFFFF",
    },
    warning: {
      light: "#F9E3AD80",
      main: "#F2C85B",
      dark: "#E08600",
      contrastText: "#FFFFFF",
    },
    info: {
      light: "#99C2E880",
      main: "#3385D1",
      dark: "#005CB1",
      contrastText: "#FFFFFF",
    },
    success: {
      light: "#A7D7BE4D",
      main: "#4DAE7E",
      dark: "#186F46",
      contrastText: "#FFFFFF",
    },
    divider: "#626D8133",
    background: {
      default: "#FFFFFF",
      paper: "#F7F9FB",
    },
    text: {
      primary: "#434C58",
      secondary: "#626D81",
      disabled: "#D0D4DA",
    },
    grey: {
      900: "#323D4D",
      800: "#495261",
      700: "#606875",
      600: "#767D88",
      500: "#8D939C",
      400: "#A4A9B0",
      300: "#BBBFC4",
      200: "#D1D4D7",
      100: "#E9EAEC",
      50: "#F3F4F5",
      A700: "#60687533",
      A400: "#A4A9B026",
      A200: "#D1D4D74D",
      A100: "#E9EAEC80",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 1024,
      lg: 1280,
      xl: 1520,
    },
  },
};
