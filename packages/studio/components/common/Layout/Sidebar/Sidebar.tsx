"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRecoilState } from "recoil";
import { authUser } from "@/config/recoil/recoilState";

import { Pagetitles } from "@/config/type/types";

import menuConfig from "@/config/menu-configure/menu-config";
import Avatar from "@mui/material/Avatar";
import { Stack, Typography, Box } from "@mui/material";

import MenuList from "./MenuList";
import { useSession } from "next-auth/react";
import { useClientSize } from "package/src/hooks/useMediaQuery";

const Sidebar = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const isMobile = useClientSize("sm");
  const pathname = usePathname() || "";

  const { data: session } = useSession();

  const [user, setUser] = useRecoilState(authUser);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!userName) setUserName(session?.user?.name ?? user.name);
  }, [pathname]);

  return (
    <div className="medium-screen-layout">
      <Box
        component="aside"
        className="sidebar"
        sx={{
          width: isMobile ? null : isCollapsed ? "4rem" : "12rem",
          bgcolor: "white",
          transition: "width 0.3s ease-in-out",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            bgcolor: "white",
            width: isCollapsed ? "4rem" : "12rem",
            height: "100%",
            transition: "width 0.3s ease-in-out",
            overflow: "hidden",
            borderRight: "4px solid #F0F0F0",
          }}
        >
          <Box sx={{ height: 60 }}></Box>
          <Box sx={{ p: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 3,
                height: "3rem",
                overflow: "hidden",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar>CH</Avatar>
                {!isCollapsed && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.75rem",
                        color: "gray",
                        whiteSpace: "nowrap",
                      }}
                    >
                      관리자
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {`${userName}님`}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>

            <Box
              sx={{
                borderBottom: "2px solid #D2d2d2",
                borderColor: "gray.300",
                mt: 3,
              }}
            />
          </Box>
          <MenuList isCollapsed={isCollapsed} />
        </Box>
      </Box>
    </div>
  );
};

export default Sidebar;
