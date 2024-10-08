import {
  Box,
  ButtonBase,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

type Options = "light" | "main" | "dark";
type Color = "primary" | "info" | "secondary" | "success" | "warning" | "error";
type Option = `${Color}.${Options}`;

interface Props {
  children?: React.ReactNode;
  firstColor?: Option;
  secondColor?: Option;
  width?: number | string;
  height?: number | string;
  title: string;
  shadow?: number;
  loading: boolean;
  pgColor?: string;
  refresh?: boolean;
  refreshReturn?: () => void;
}

const CardComponent = ({
  children,
  firstColor,
  secondColor,
  title,
  loading,
  refresh = false,
  refreshReturn,
  ...props
}: Props) => {
  const theme = useTheme();

  const getColor = (color: string) => {
    const [palette, shade] = color.split(".") as [
      keyof typeof theme.palette,
      string,
    ];
    const ptColor = theme.palette[palette];

    if (ptColor && typeof ptColor === "object" && shade in ptColor)
      return ptColor[shade as keyof typeof ptColor];

    return undefined;
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: props.width ?? 300,
          height: props.height ?? 150,
          mx: 1,
        }}
      >
        <Box
          sx={{
            height: 40,
            px: 0.5,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: 50,
                mr: 1,
                background: (theme) => getColor(firstColor ?? "info.main"),
              }}
            ></Box>
            <Typography variant="subtitle2" color="text.secondary">
              {title ?? ""}
            </Typography>
          </Box>
          <Box>
            {refresh && (
              <ButtonBase onClick={refreshReturn}>
                <RefreshIcon color="secondary" />
              </ButtonBase>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            height: "100%",
            background: (theme) =>
              `linear-gradient(to right, ${getColor(firstColor ?? "info.main")}, ${getColor(secondColor ?? "secondary.dark")})`,
            boxShadow: props.shadow ?? 6,
            borderRadius: 2,
          }}
        >
          {loading ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Stack
                sx={{ color: props.pgColor || "white" }}
                spacing={2}
                direction="row"
              >
                <CircularProgress color="inherit" />
              </Stack>
            </Box>
          ) : (
            <>{children}</>
          )}
        </Box>
      </Box>
    </>
  );
};

export default CardComponent;
