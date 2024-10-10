"use client";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import DashboardComponent from "./DashboardComponent";
import DashboardRight from "./DashboardRight";

const DashboardMob = () => {
  const [value, setValue] = useState<string>("work");

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const buttons = [
    { label: "업무관리", toggle: "work" },
    { label: "전체현황", toggle: "status" },
  ];

  return (
    <>
      <Box
        sx={{
          mb: 1.5,
          borderBottom: (theme) => `1px solid ${theme.palette.text.disabled}`,
          height: 30,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {buttons.map((button) => (
          <Button
            key={button.toggle}
            sx={{
              color: value === button.toggle ? "black" : "gray",
              borderBottom:
                value === button.toggle ? "2px solid black" : "none",
              borderRadius: 0,
            }}
            onClick={() => {
              handleChange(button.toggle);
            }}
          >
            {button.label}
          </Button>
        ))}
      </Box>
      {value === "work" ? (
        <DashboardRight padding={1} />
      ) : (
        <DashboardComponent />
      )}
    </>
  );
};

export default DashboardMob;
