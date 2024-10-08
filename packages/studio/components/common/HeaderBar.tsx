import React, { useState, useEffect, useCallback } from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useRecoilState } from "recoil";
import { authUser } from "@/config/recoil/recoilState";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { usePathname, useRouter } from "next/navigation";
import { Box, Drawer, Fade, Menu, MenuItem, Typography } from "@mui/material";
import { signOut } from "next-auth/react";
import { useClientSize } from "package/src/hooks/useMediaQuery";
import MenuList from "./Layout/Sidebar/MenuList";
import HeaderClock from "./Layout/Header/HeaderClock";

export enum DrawerType {
  "none" = "none",
  "form" = "form",
}

const Clock = ({ onToggleSidebar }: { onToggleSidebar: any }) => {
  const router = useRouter();
  const isMobile = useClientSize("sm");
  const pathname = usePathname() || "";

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [user, setUser] = useRecoilState(authUser);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      onToggleSidebar(newValue);
      return newValue;
    });
  }, [onToggleSidebar]);

  const onClickLogout = async () => {
    setUser({
      _id: "",
      isAdmin: false,
      name: "",
      username: "",
      menuAccess: "",
      isSuperAccount: false,
    });
    signOut({ redirect: false });
    router.push("/sign/login");
  };

  useEffect(() => {
    if (isMobile && anchorEl) handleClose();
  }, [pathname]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          position: "fixed",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "white",
          height: 55,
          px: 2,
          borderBottom: "4px solid #F0F0F0",
          zIndex: 999,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {!isMobile && (
            <Typography
              sx={{
                letterSpacing: "-0.01562em",
                fontWeight: "bold",
                width: "10rem",
                color: "black",
                fontSize: "1.125rem",
              }}
            >
              STUDIO CHAMCHI
            </Typography>
          )}
          <IconButton onClick={isMobile ? handleClick : toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Menu
            id="fade-menu"
            MenuListProps={{
              "aria-labelledby": "fade-button",
              sx: {
                background: "white",
              },
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            <MenuList isCollapsed={false} />
          </Menu>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {!isMobile && <HeaderClock />}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            color="inherit"
            onClick={onClickLogout}
          >
            <ExitToAppIcon sx={{ color: "#6A24FE", fontSize: 30 }} />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};

export default Clock;
