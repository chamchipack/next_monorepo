"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { useRecoilState } from "recoil";
import { authUser } from "@/config/recoil/recoilState";

import { signOut } from "next-auth/react";
import { motion } from "framer-motion";

import { Box, Typography, IconButton } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { nanumFont } from "package/styles/fonts/module";
import { useClientSize } from "package/src/hooks/useMediaQuery";

import HeaderButton from "./HeaderButton";
import MenuToggleIcon from "./MenuToggle";
import HeaderClock from "./HeaderClock";

const HeaderContainer = () => {
  const isMobile = useClientSize("sm");
  const router = useRouter();
  const [user, setUser] = useRecoilState(authUser);

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

  return (
    <>
      <Box
        component={motion.div}
        initial={{ height: 45 }}
        animate={{ height: isMobile ? 100 : 45 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "column",
          px: 1,
          position: "fixed",
          overflow: "hidden",
          borderBottom: "2px solid #F0F0F0",
          zIndex: 1000,
          background: "white",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MenuToggleIcon />

          <Typography
            variant="h5"
            sx={{ color: "text.secondary", ...nanumFont }}
          >
            Studio Chamchi
          </Typography>

          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            {!isMobile && <HeaderClock />}
            <IconButton color="inherit" onClick={onClickLogout}>
              <ExitToAppIcon sx={{ color: "#6A24FE", fontSize: 25 }} />
            </IconButton>
          </Box>
        </Box>

        {isMobile && <HeaderButton />}
      </Box>
    </>
  );
};

export default HeaderContainer;
