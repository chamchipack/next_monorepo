import { useRecoilState } from "recoil";
import { Box, FormControl, TextField, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PaymentDataGridAtom from "../state";

const Model = [
  {
    text: "날짜검색",
    value: "date",
    icon: ApartmentIcon,
    theme: "warning",
  },
  {
    text: "이름검색",
    value: "name",
    icon: DirectionsCarIcon,
    theme: "info",
  },
];

const PaymentFilter = () => {
  const [category, setCategory] = useState<string>("date");

  const searchKeywordRef = useRef<HTMLInputElement>(null);

  const [dataGridPaymentState, setDataGridPaymentState] =
    useRecoilState(PaymentDataGridAtom);

  const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ("Enter" === e.key) {
      e.preventDefault();
      setDataGridPaymentState({
        "studentName.like": searchKeywordRef.current?.value,
      });
    }
  };

  useEffect(() => {
    return () => {
      setDataGridPaymentState({});
    };
  }, []);

  return (
    <>
      <FormControl fullWidth size="small">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mr: 2,
          }}
        >
          <TextField
            id="schedule-end"
            type="month"
            value={dataGridPaymentState["paymentDate.like"]}
            onChange={(e) =>
              setDataGridPaymentState({
                ...dataGridPaymentState,
                "paymentDate.like": e.target.value as string,
              })
            }
            sx={{
              borderColor: "#d2d2d2",
              borderRadius: 1,
              height: 40,
            }}
            InputProps={{
              style: { height: 40 },
            }}
          />
        </Box>
      </FormControl>
    </>
  );
};

export default PaymentFilter;
