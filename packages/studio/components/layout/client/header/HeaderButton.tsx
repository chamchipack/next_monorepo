import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Box, IconButton, SvgIconProps, Typography } from "@mui/material";

import { useRecoilState } from "recoil";
import { breadCrumbState } from "@/config/recoil/breadcrumb/state";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

import EditAccessAtom from "@/config/type/access/state";
import menuConfig, { getIsEditable } from "@/config/menu-configure/menu-config";

import ProgressDialog from "package/src/Modal/ProgressModal";

interface Menu {
  _id: string;
  icon: React.ElementType<SvgIconProps>;
  title: string;
  target: string;
}

const breadCrumbFind = (path: string) =>
  menuConfig.find(({ target = "" }) => target === path) || {
    title: "",
    desc: "",
  };

export default function HeaderButton() {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname() || "";

  const [isRendering, setIsRendering] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [, setEditAccessState] = useRecoilState(EditAccessAtom);
  const [, setBreadCrumb] = useRecoilState(breadCrumbState);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  useEffect(() => {
    setIsRendering(true);
  }, []);

  const menuConfigure = useMemo(() => {
    if (!session) return [];

    const {
      menuAccess = "",
      isSuperAccount = false,
      isAdmin = false,
    } = session?.user;

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
      router.push("/error");
      return [];
    }
  }, [session, pathname]);

  const menuAuth = useCallback(() => {
    if (!menuConfigure.length) return;

    const targets = menuConfigure.map(({ target = "" }) => target) || [];
    if (!targets.includes(pathname)) router.push("/error");
  }, [menuConfigure, pathname, router]);

  useEffect(() => {
    menuAuth();
  }, [menuAuth]);

  useEffect(() => {
    if (openModal) handleClose();
    setOnBreadCrumb();
  }, [pathname]);

  const setOnBreadCrumb = useCallback(() => {
    const { title, desc = "" } = breadCrumbFind(pathname);
    setBreadCrumb({ title, desc });
  }, [pathname]);

  if (!isRendering) return null;

  return (
    <Box sx={{ width: "100%", background: "" }}>
      <ProgressDialog open={openModal} onClose={handleClose} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          height: 50,
          gap: 2,
        }}
      >
        {menuConfigure.map((item) => (
          <Box
            component={motion.div}
            key={item._id}
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Link href={`${item.target}`} style={{ textDecoration: "none" }}>
              <IconButton
                sx={{
                  "&:hover": {
                    background: "#EFE8FF",
                  },
                }}
                onClick={() => {
                  if (pathname === item.target) return;
                  handleOpen();
                }}
              >
                {React.createElement(item.icon, {
                  style: {
                    fontSize: 18,
                    color: pathname !== item.target ? "#0F172A" : "#6A24FE",
                    transition: "color 0.3s ease-in-out",
                  },
                })}
              </IconButton>
            </Link>
            <Typography
              variant="caption"
              sx={{
                fontSize: 8,
                color: pathname !== item.target ? "#363738" : "#6A24FE",
              }}
            >
              {item.title}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
