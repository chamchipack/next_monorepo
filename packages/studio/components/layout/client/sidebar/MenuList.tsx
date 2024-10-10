"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useRecoilState } from "recoil";
import { authUser } from "@/config/recoil/recoilState";
import Link from "next/link";

import ProgressDialog from "package/src/Modal/ProgressModal";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import menuConfig, { getIsEditable } from "@/config/menu-configure/menu-config";
import { Box, SvgIconProps, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import EditAccessAtom from "@/config/type/access/state";
import { breadCrumbState } from "@/config/recoil/breadcrumb/state";

interface Props {
  isCollapsed: boolean;
}

type Menu = {
  _id: string;
  icon: React.ElementType<SvgIconProps>;
  title: string;
  target: string;
};

const breadCrumbFind = (path: string) =>
  menuConfig.find(({ target = "" }) => target === path) || {
    title: "",
    desc: "",
  };

const MenuList = ({ isCollapsed }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname() || "";

  const [, setEditAccessState] = useRecoilState(EditAccessAtom);
  const [, setBreadCrumb] = useRecoilState(breadCrumbState);
  const [openModal, setOpenModal] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>("");

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const menuConfigure = useMemo(() => {
    if (!session) return [];

    const {
      menuAccess = "",
      isSuperAccount = false,
      isAdmin = false,
    } = session?.user;

    // 관리자는 전체 메뉴 할당
    if (isSuperAccount || isAdmin) {
      setEditAccessState(true);
      return menuConfig;
    }

    try {
      const access = JSON.parse(decodeURIComponent(escape(atob(menuAccess))));

      setEditAccessState(getIsEditable(pathname, access));
      return menuConfig.reduce((acc: Menu[], { _id = "", ...rest }) => {
        const { access: _access } = access[_id] || {};
        if (_access) acc.push({ _id, ...rest });
        return acc;
      }, []);
    } catch (e) {
      // router.push("/error");
      return [];
    }
  }, [session, pathname]);

  const menuAuth = useCallback(() => {
    if (!menuConfigure.length) return;

    const targets = menuConfigure.map(({ target = "" }) => target) || [];
    // if (!targets.includes(pathname)) router.push("/error");
  }, [menuConfigure, pathname, router]);

  useEffect(() => {
    menuAuth();
  }, [menuAuth]);

  const setOnBreadCrumb = useCallback(() => {
    const { title, desc = "" } = breadCrumbFind(pathname);
    setBreadCrumb({ title, desc });
  }, [pathname]);

  useEffect(() => {
    setOnBreadCrumb();

    setCurrentPath(pathname);

    if (openModal) handleClose();
  }, [pathname]);

  return (
    <>
      <ProgressDialog open={openModal} onClose={handleClose} />
      <List
        sx={{ overflow: "hidden" }}
        style={{
          textDecoration: "inherit",
        }}
      >
        {menuConfigure.map((item) => (
          <Box component={motion.div} key={item._id}>
            <Link href={`${item.target}`} style={{ textDecoration: "none" }}>
              <ListItemButton
                data-cy={`menu-item-${item.target}`}
                onClick={() => {
                  if (currentPath !== item.target) handleOpen();
                }}
                sx={{
                  mt: 1,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  background: "red",
                  height: "45px",
                }}
                style={{
                  background: currentPath === item.target ? "#EFE8FF" : "white",
                }}
              >
                <ListItemIcon sx={{ minHeight: "inherit" }}>
                  {React.createElement(item.icon, {
                    style: {
                      color:
                        currentPath !== item.target ? "#0F172A" : "#6A24FE",
                      transition: "color 0.3s ease-in-out",
                    },
                  })}
                </ListItemIcon>
                {!isCollapsed && (
                  <Typography
                    noWrap
                    sx={{
                      whiteSpace: "nowrap",
                      opacity: isCollapsed ? 0 : 1,
                      width: isCollapsed ? 0 : "auto",
                      transition:
                        "opacity 0.3s ease-in-out, width 0.3s ease-in-out",
                      color:
                        currentPath !== item.target ? "#363738" : "#6A24FE",
                      fontWeight: "bold",
                    }}
                  >
                    {item.title}
                  </Typography>
                )}
              </ListItemButton>
            </Link>
          </Box>
        ))}
      </List>
    </>
  );
};

export default MenuList;
