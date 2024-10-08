"use client";
import React, { useState } from "react";
import SessionComponent from "@/components/v2/Session/SessionComponent";
import SessionGrid from "@/components/v2/Session/lib/SessionGrid";
import { Box, Button, Skeleton } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SessionFilter from "@/components/v2/Session/lib/SessionFilter";
import useIsRendering from "package/src/hooks/useRenderStatus";
import { useClientSize } from "package/src/hooks/useMediaQuery";
import SessionMobile from "./SessionMobile";

const Session = () => {
  const isRendering = useIsRendering();
  const isMobile = useClientSize("sm");
  const [selectedIcon, setSelectedIcon] = useState<string>("calendar");

  const handleToggle = (
    event: React.MouseEvent<HTMLElement>,
    newIcon: string | null
  ) => {
    if (newIcon !== null) setSelectedIcon(newIcon);
  };

  if (!isRendering)
    return (
      <>
        <Skeleton sx={{ width: "100%", height: 30 }} />
        <Skeleton sx={{ width: "100%", height: 30 }} />
        <Skeleton sx={{ width: "100%", height: 30 }} />
        <Skeleton sx={{ width: "100%", height: 300 }} />
      </>
    );

  if (isMobile) return <SessionGrid />;

  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "row", justifyContent: "end" }}
      >
        <ToggleButtonGroup
          value={selectedIcon}
          exclusive
          onChange={handleToggle}
          aria-label="icon toggle button"
          size="small"
        >
          <ToggleButton value="grid" aria-label="auto awesome">
            <AutoAwesomeMosaicIcon />
          </ToggleButton>
          <ToggleButton value="calendar" aria-label="calendar month">
            <CalendarMonthIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {selectedIcon === "calendar" ? (
        <SessionComponent />
      ) : (
        <>
          <SessionGrid />
        </>
      )}
    </>
  );
};

export default Session;
