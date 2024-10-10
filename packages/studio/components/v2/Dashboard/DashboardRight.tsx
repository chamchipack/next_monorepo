import { Box, Button, Divider, Typography } from "@mui/material";
import { useState } from "react";

import AssignmentIcon from "@mui/icons-material/Assignment";
import AddCardIcon from "@mui/icons-material/AddCard";
import AttendanceList from "./lib/AttendanceList";
import moment from "moment";
import PaymentList from "./lib/PaymentList";
import { useClientSize } from "package/src/hooks/useMediaQuery";

interface Props {
  [key: string]: any;
}

const DashboardRight = (props: Props) => {
  const isMobile = useClientSize("sm");
  const [toggle, setToggle] = useState<string>("attendance");

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "90%",
          p: props.padding ?? 3,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box
            sx={{
              width: 3,
              background: (theme) => theme.palette.info.main,
              mr: 1,
            }}
          />
          <Typography color="text.primary" variant="h4">
            수강생{" "}
            <Typography component="span" color="primary.dark" variant="h4">
              업무관리
            </Typography>
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Divider />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box>
              <Button
                variant="outlined"
                size="medium"
                onClick={() => {
                  setToggle("attendance");
                }}
                sx={{
                  pl: 1,
                  pr: 1,
                  mr: 1,
                  mb: 1,
                  borderRadius: 1,
                  border: (theme) => `1.5px solid ${theme.palette.grey[100]}`,
                  borderColor:
                    toggle === "attendance" ? "primary.dark" : "text.disabled",
                  color:
                    toggle === "attendance" ? "primary.dark" : "text.disabled",
                }}
              >
                <AssignmentIcon
                  style={{ fontSize: 16 }}
                  sx={{ mr: 1 }}
                  color="success"
                />
                출석관리
              </Button>
            </Box>
            <Box>
              <Button
                variant="outlined"
                size="medium"
                onClick={() => {
                  setToggle("payments");
                }}
                sx={{
                  pl: 1,
                  pr: 1,
                  mr: 0.5,
                  mb: 1,
                  borderRadius: 1,
                  border: (theme) => `1.5px solid ${theme.palette.grey[100]}`,
                  borderColor:
                    toggle === "payments" ? "secondary.dark" : "text.disabled",
                  color:
                    toggle === "payments" ? "secondary.dark" : "text.disabled",
                }}
              >
                <AddCardIcon
                  style={{ fontSize: 16 }}
                  sx={{ mr: 1 }}
                  color="info"
                />
                결제관리
              </Button>
            </Box>
          </Box>
        </Box>

        {toggle === "attendance" ? (
          <Typography variant="subtitle2" sx={{ my: 1 }}>
            {moment().format("M월 D일")} 출석 대상자
          </Typography>
        ) : null}

        {toggle === "attendance" ? <AttendanceList /> : <PaymentList />}
      </Box>
    </>
  );
};

export default DashboardRight;
