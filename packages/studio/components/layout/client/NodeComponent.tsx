"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { useRecoilState, useRecoilValue } from "recoil";
import { authUser } from "@/config/recoil/recoilState";
import { toggleCollapsed } from "@/config/recoil/sample/toggle";
import { breadCrumbState } from "@/config/recoil/breadcrumb/state";

import { motion } from "framer-motion";

import { Box, Typography } from "@mui/material";

import { useClientSize } from "package/src/hooks/useMediaQuery";
import useIsRendering from "package/src/hooks/useRenderStatus";

import styles from "../layout.module.css";
import { Skeleton } from "@mui/material";
interface PathInfo {
  pathname: string;
  breadCrumb: { title?: string; desc?: string };
}

const PathInformation = ({ pathname, breadCrumb }: PathInfo) => {
  // if (isMobile) return null;
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient)
    return (
      <>
        <div className={styles["responsive-component"]}>
          <Skeleton sx={{ width: 100, height: 30 }} />
          <Skeleton sx={{ width: 200, height: 30 }} />
        </div>
      </>
    );

  return (
    <div
      style={{ marginBottom: 2, marginTop: 2 }}
      className={styles["responsive-component"]}
    >
      {pathname !== "/workspace/main" && (
        <>
          <Typography variant="h5" sx={{ fontSize: "bold", mb: 1 }}>
            {breadCrumb?.title || ""}
          </Typography>
          <Typography
            variant="subtitle2"
            style={{ color: "#C2C2C2", fontSize: "bold" }}
          >
            {breadCrumb?.desc || ""}
          </Typography>
        </>
      )}
    </div>
  );
};

export default function NodeComponent({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { data: session, status } = useSession();
  const pathname = usePathname() || "";
  const isMobile = useClientSize("sm");
  const isRendering = useIsRendering();

  const [user, setUser] = useRecoilState(authUser);
  const breadCrumb = useRecoilValue(breadCrumbState);
  const isCollapsed = useRecoilValue(toggleCollapsed);

  const headerHeight = !isRendering ? 45 : isMobile ? 100 : 45;
  const sidebarWidth = !isRendering ? 0 : isMobile ? 0 : isCollapsed ? 60 : 180;

  useEffect(() => {
    if (session && !user?._id) {
      const { id, isAdmin, isSuperAccount, name, menuAccess, username } =
        session?.user;
      setUser({
        _id: id || "",
        isAdmin: isAdmin || false,
        name: name || "",
        username: username || "",
        menuAccess: menuAccess || "",
        isSuperAccount: isSuperAccount || false,
      });
    }
  }, [session]);

  return (
    <>
      <Box
        component={motion.div}
        initial={false}
        animate={{
          marginTop: headerHeight,
          marginLeft: sidebarWidth,
          width: `calc(100% - ${sidebarWidth}px)`,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        sx={{
          p: 2,
          mt: 3,
          height: `calc(100% - ${headerHeight}px)`,
        }}
      >
        <PathInformation breadCrumb={breadCrumb} pathname={pathname} />
        {children}
      </Box>
    </>
  );
}
