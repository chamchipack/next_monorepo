"use client";

import DashboardComponent from "@/components/v2/Dashboard/DashboardComponent";
import DashboardLeft from "@/components/v2/Dashboard/DashboardLeft";
import DashboardLeftMobile from "@/components/v2/Dashboard/DashboardLeftMobile";
import DashboardRight from "@/components/v2/Dashboard/DashboardRight";
import { useClientSize } from "package/src/hooks/useMediaQuery";
import { Box, Button, Skeleton } from "@mui/material";

import useIsRendering from "package/src/hooks/useRenderStatus";
import DashboardMob from "@/components/v2/Dashboard/DashboardMob";

const Page = () => {
  const isMobile = useClientSize("sm");
  const isRendering = useIsRendering();

  if (!isRendering)
    return (
      <>
        <Skeleton sx={{ width: 200 }} />
        <Skeleton sx={{ width: 300, height: 150 }} />
        <Skeleton sx={{ width: 300, height: 150 }} />
      </>
    );

  if (isMobile) return <DashboardMob />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: `calc(100vh - ${100}px)`,
      }}
    >
      <Box sx={{ width: "100%", p: 1 }}>
        <DashboardComponent />
      </Box>
      <Box sx={{ width: { xs: "0", sm: "30%", p: { xs: 0, sm: 1 } } }}>
        <DashboardRight />
      </Box>
    </Box>
  );
};

export default Page;
