import MenuIcon from "@mui/icons-material/Menu";
import useIsRendering from "package/src/hooks/useRenderStatus";
import { useClientSize } from "package/src/hooks/useMediaQuery";
import { IconButton } from "@mui/material";
import { useRecoilState } from "recoil";
import { toggleCollapsed } from "@/config/recoil/sample/toggle";

export default function MenuToggleIcon() {
  const isMobile = useClientSize("sm");
  const isRendering = useIsRendering();

  const [isCollapsed, setIsCollapsed] = useRecoilState(toggleCollapsed);

  if (!isRendering) return <div />;

  if (isMobile) return <div />;

  return (
    <IconButton
      color="inherit"
      onClick={() => {
        setIsCollapsed(!isCollapsed);
      }}
    >
      <MenuIcon sx={{ color: "text.secondary" }} />
    </IconButton>
  );
}
