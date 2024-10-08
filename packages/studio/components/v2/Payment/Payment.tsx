import { Box } from "@mui/material";
import PaymentCheck from "./lib/PaymentCheck";
import PaymentFilter from "./lib/PaymentFilter";

const Payment = () => {
  return (
    <>
      <Box sx={{ height: "4%", background: "", pt: 1 }}>
        <PaymentFilter />
      </Box>

      <Box sx={{ height: "95%", background: "" }}>
        <PaymentCheck />
      </Box>
    </>
  );
};

export default Payment;
