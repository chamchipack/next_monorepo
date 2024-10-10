import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { useRecoilState } from "recoil";
import { toggleCollapsed } from "@/config/recoil/sample/toggle";
import styles from "../../layout.module.css";

export default function MenuToggleIcon() {
  const [isCollapsed, setIsCollapsed] = useRecoilState(toggleCollapsed);

  return (
    <div className={styles["responsive-component"]}>
      <IconButton
        color="inherit"
        onClick={() => {
          setIsCollapsed(!isCollapsed);
        }}
      >
        <MenuIcon sx={{ color: "text.secondary" }} />
      </IconButton>
    </div>
  );
}
