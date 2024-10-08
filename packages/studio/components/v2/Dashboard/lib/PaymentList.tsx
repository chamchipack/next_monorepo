import { CircleSharp } from "@mui/icons-material";
import { Box, Button, ButtonBase, Typography, alpha } from "@mui/material";
import { useState } from "react";
// import PaymentBatchList from "./PaymentBatchList";
import PaymentRegularList from "./PaymentRegularList";
import moment from "moment";
import PaymentPackageList from "./PaymentPackageList";

const PaymentList = () => {
  const [toggle, setToggle] = useState<string>("regular");
  const [total, setTotal] = useState(0);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          height: "100%",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", mt: 2 }}>
          <Box>
            <Button
              variant="outlined"
              size="medium"
              onClick={() => {
                setToggle("regular");
              }}
              sx={{
                pl: 1,
                pr: 1,
                mr: 0.5,
                mb: 1,
                borderRadius: 4,
                border: (theme) => `1.5px solid ${theme.palette.grey[100]}`,
                borderColor:
                  toggle === "regular" ? "primary.dark" : "text.disabled",
                color: toggle === "regular" ? "primary.dark" : "text.disabled",
              }}
            >
              <CircleSharp
                style={{ fontSize: 6 }}
                sx={{ mr: 1 }}
                color="success"
              />
              정기결제
            </Button>
          </Box>
          <Box>
            <Button
              variant="outlined"
              size="medium"
              onClick={() => {
                setToggle("batch");
              }}
              sx={{
                pl: 1,
                pr: 1,
                mr: 0.5,
                mb: 1,
                borderRadius: 4,
                border: (theme) => `1.5px solid ${theme.palette.grey[100]}`,
                borderColor:
                  toggle === "batch" ? "secondary.dark" : "text.disabled",
                color: toggle === "batch" ? "secondary.dark" : "text.disabled",
              }}
            >
              <CircleSharp
                style={{ fontSize: 6 }}
                sx={{ mr: 1 }}
                color="secondary"
              />
              회차결제
            </Button>
          </Box>
        </Box>
        <Box sx={{ my: 1, mt: 0, mb: 0, height: "100%", }}>
          <Box sx={{ overflowY: "auto", height: "80%", mt: 2 }}>
            {toggle === "regular" ? (
              <>
                {/* <PaymentRegularList setTotal={setTotal} /> */}
                <PaymentRegularList />
              </>
            ) : (
              <>
                {/* <PaymentBatchList setTotal={setTotal} /> */}
                <PaymentPackageList />
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PaymentList;
