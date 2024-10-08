import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import { Theme } from "@mui/material/styles/createTheme";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }: { theme: Theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    marginRight: 15,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1] as string,
  },
}));

export default LightTooltip;
