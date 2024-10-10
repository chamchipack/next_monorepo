"use client";
import Link from "next/link";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React, { useEffect, useState } from "react";
import menuConfig from "@/config/menu-configure/menu-config";
import { useRouter, usePathname } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import { Stack, Typography, Box } from "@mui/material";
import { Pagetitles } from "@/config/type/types";
import ProgressDialog from "package/src/Modal/ProgressModal";
import { useRecoilState } from "recoil";
import { authUser } from "@/config/recoil/recoilState";

interface Menu {
  _id: string;
  title: string;
  target: string;
  icon: any;
}

const Sidebar = ({
  setTitle,
  isCollapsed,
}: {
  setTitle: React.Dispatch<React.SetStateAction<Pagetitles>>;
  isCollapsed: boolean;
}) => {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string>("");
  const pathname = usePathname() || "";
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useRecoilState(authUser);
  const [userName, setUserName] = useState("");
  const [menuConfigure, setMenuConfigure] = useState<Menu[]>([]);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const menuAuth = () => {
    const { menuAccess = "", isSuperAccount = false } = user;

    if (isSuperAccount) return setMenuConfigure(menuConfig);
    try {
      const access = JSON.parse(decodeURIComponent(escape(atob(menuAccess))));
      const menus = menuConfig.reduce((acc, { _id = "", ...rest }) => {
        const { access: _access, editable } = access[_id] || {};
        if (_access) acc.push({ _id, ...rest });
        return acc;
      }, []);
      setMenuConfigure(menus);
    } catch (e) {
      router.push("/error");
    }
  };

  useEffect(() => {
    menuAuth();
  }, []);

  useEffect(() => {
    setCurrentPath(pathname);
    const { title = "", desc = "" } =
      menuConfig.find(({ target = "" }) => target === pathname) || {};
    setTitle({ title, desc });
    handleClose();
    if (!userName) setUserName(user.name);
  }, [pathname]);

  return (
    <div
      className={`bg-white ${isCollapsed ? "w-16" : "w-48"} shadow-2xl h-screen transition-width duration-300 ease-in-out truncate border-r-4 border-[#F0F0F0]`}
    >
      <ProgressDialog open={openModal} onClose={handleClose} />
      <div className="p-2">
        {/* <div className="border-t-2 border-gray-300" /> */}
        <div className="flex justify-center items-center mt-3 h-12 ">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar>CH</Avatar>
            {!isCollapsed && (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
              >
                <Typography
                  variant="caption"
                  style={{ fontSize: "0.75rem", color: "gray" }}
                >
                  {" "}
                  관리자{" "}
                </Typography>
                <Typography
                  variant="body2"
                  style={{ fontWeight: "bold", fontSize: "1rem" }}
                >
                  {" "}
                  {`${userName}님`}
                </Typography>
              </Box>
            )}
          </Stack>
        </div>
        <div className="border-b-2 mt-3 border-gray-300" />
      </div>
      <List className="justify-center items-center">
        {menuConfigure.map((item) => (
          <Link href={`${item.target}`} key={item._id}>
            <ListItemButton
              onClick={handleOpen}
              className="mt-1 truncate h-12"
              style={{
                background: currentPath === item.target ? "#EFE8FF" : "white",
              }}
            >
              <ListItemIcon>
                {React.createElement(item.icon, {
                  style: {
                    color: currentPath !== item.target ? "#0F172A" : "#6A24FE",
                  },
                })}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    style: {
                      color:
                        currentPath !== item.target ? "#363738" : "#6A24FE",
                      fontWeight: "bold",
                    },
                  }}
                />
              )}
            </ListItemButton>
          </Link>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
