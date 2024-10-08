"use client";
import { DefaultType } from "@/config/type/DefaultType/type";
import Toolbar from "./Tool/Toolbar";
import Panel, { PanelRef } from "./Tool/Panel";

import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";

type Widget = {
  name: string;
  id: string;
  component: () => Promise<React.ComponentType<any>>;
};

const Layout = ({
  setToggle,
  dynamicInfo,
}: {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  dynamicInfo: DefaultType["dynamic"];
}) => {
  const [selectedWidgets, setSelectedWidgets] = useState<Widget[]>([]);

  const bRef = useRef<PanelRef>();

  const callBFunction = () => {
    if (bRef.current) bRef.current.externalFunction(selectedWidgets); // B 컴포넌트의 함수 호출
  };

  const onClickSaveLayout = () => {
    if (bRef.current) bRef.current.onClickSaveLayout(); // B 컴포넌트의 함수 호출
  };

  const onClickCancel = () => {
    setToggle(false);
    if (bRef.current) bRef.current.onClickReset();
  };

  useEffect(() => {
    callBFunction();
  }, [selectedWidgets]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "97%",
        display: "flex",
      }}
    >
      <Box sx={{ minWidth: "3%", height: "100%" }}>
        <Toolbar
          setSelectedWidgets={setSelectedWidgets}
          onClickSaveLayout={onClickSaveLayout}
          onClickCancel={onClickCancel}
          setToggle={setToggle}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          marginLeft: "5px",
          border: "2px solid #d2d2d2",
          borderRadius: "10px",
        }}
      >
        <Panel ref={bRef} devMode={true} dynamicInfo={dynamicInfo} />
      </Box>
    </Box>
  );
};

export default Layout;
