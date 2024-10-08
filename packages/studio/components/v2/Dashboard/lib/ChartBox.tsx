import React from "react";
import EnrollmentChart from "./EnrollmentChart";
import AttendanceChart from "./AttendanceChart";
import { Box } from "@mui/material";

const ChartBox = () => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "60%",
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          mt: 1,
        }}
      >
        <EnrollmentChart />
        <AttendanceChart />
      </Box>
    </>
  );
};

export default ChartBox;
