"use client";
import { useRecoilValue } from "recoil";
import { toggleCollapsed } from "@/config/recoil/sample/toggle";

import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

import useIsRendering from "package/src/hooks/useRenderStatus";
import { useClientSize } from "package/src/hooks/useMediaQuery";
import MenuList from "./MenuList";

export default function Sidebar() {
  const isMobile = useClientSize("sm");
  const isRendering = useIsRendering();
  const isCollapsed = useRecoilValue(toggleCollapsed);
  const { data: session } = useSession();

  if (!isRendering) return null;

  if (isMobile) return null;

  return (
    <Box
      component={motion.div}
      initial={{ width: 0 }}
      animate={{ width: isMobile ? 0 : isCollapsed ? 60 : 180 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      sx={{
        position: "fixed",
        bgcolor: "white",
        height: "100%",
        overflow: "hidden",
        borderRight: "4px solid #F0F0F0",
      }}
    >
      <div style={{ height: 50 }} />
      <Box sx={{ p: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 3,
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
                  {session?.user?.name ? `${session?.user?.name}님` : ""}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>

        <Divider sx={{ mt: 3 }} />
      </Box>
      <MenuList isCollapsed={isCollapsed} />
    </Box>
  );
}
